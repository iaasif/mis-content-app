import {
  HttpClient, HttpEventType, HttpResponse
} from '@angular/common/http';
import {
  AfterViewChecked, Component, ElementRef,
  inject, NgZone, output, signal, viewChild, input, computed, linkedSignal
} from '@angular/core';
import { filter, map, tap } from 'rxjs/operators';
import { HotToastService } from '@ngxpert/hot-toast';
import { StoreDataService } from '../../../features/pages/mis/services/store-data-service';
import { UploadHtmlResponse, UploadImgApiResponse } from '../../../features/pages/mis/models/jobs.data';
import { DecimalPipe } from '@angular/common';

export const DefaultMaxSize = 9_000_000;

let fileInputIdCounter = 0;

// ── Types ──────────────────────────────────────────────────────────────────────

export type DetectedFileType = 'image' | 'pdf' | 'zip' | 'html' | 'unknown';

export interface ManagedFile {
  readonly id: number;
  readonly file: File;
  readonly name: string;
  readonly size: string;           // formatted e.g. "1.23 MB"
  readonly detectedType: DetectedFileType;
  readonly isImage: boolean;
  previewUrl: string | null;       // object-URL, revoked after upload/cancel
  progress: string;                // "0%" … "100%"
  uploadStatus: 'idle' | 'uploading' | 'done' | 'error';
  errorMessage: string;
  resultUrl: string;               // returned public URL after success
}

// ── Helpers ────────────────────────────────────────────────────────────────────

let managedFileId = 0;

const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp']);
const PDF_EXTS = new Set(['pdf']);
const ZIP_EXTS = new Set(['zip', 'rar', '7z']);
const HTML_EXTS = new Set(['html', 'htm']);

function detectType(file: File): DetectedFileType {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (IMAGE_EXTS.has(ext)) return 'image';
  if (PDF_EXTS.has(ext)) return 'pdf';
  if (ZIP_EXTS.has(ext)) return 'zip';
  if (HTML_EXTS.has(ext)) return 'html';
  return 'unknown';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Component ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent implements AfterViewChecked {

  // ── DI ──────────────────────────────────────────────────────────────────────
  private readonly http = inject(HttpClient);
  private readonly ngZone = inject(NgZone);
  private readonly hotToast = inject(HotToastService);
  private readonly storeDataService = inject(StoreDataService);

  // ── Unique DOM id ────────────────────────────────────────────────────────────
  readonly fileInputId = `app-file-upload-input-${++fileInputIdCounter}`;

  // ── Inputs ───────────────────────────────────────────────────────────────────
  readonly maxFileSizeInBytes = input<number>(DefaultMaxSize);
  readonly maxWidth = input<number>(20_000);
  readonly maxHeight = input<number>(20_000);
  readonly uploadTitle = input<string>('Upload Files');
  readonly uploadIcon = input<string>('');
  readonly imgUrl = input.required<string>();   // endpoint for images
  readonly fileUploadUrl = input.required<string>();   // endpoint for pdf/zip/html
  readonly payload = input.required<Record<string, string | number | undefined>>();

  // ── Outputs ──────────────────────────────────────────────────────────────────
  readonly response = output<UploadImgApiResponse>();
  readonly responseHtmlUp = output<UploadHtmlResponse>();
  readonly uploadInProgress = output<boolean>();

  // ── State ────────────────────────────────────────────────────────────────────
  readonly files = signal<ManagedFile[]>([]);
  readonly isDragOver = signal(false);

  /** true when ANY file is currently uploading */
  readonly anyUploading = computed(() =>
    this.files().some(f => f.uploadStatus === 'uploading')
  );

  /** All uploaded result URLs grouped by type (for parent to consume via output,
   *  but also visible inside this component if needed) */
  readonly imageFiles = computed(() => this.files().filter(f => f.isImage));
  readonly otherFiles = computed(() => this.files().filter(f => !f.isImage));

  // ── Preview ref ───────────────────────────────────────────────────────────────
  // We use a map of ElementRef per file; simpler to handle in template with
  // an id-based approach rather than viewChild for dynamic lists.

  ngAfterViewChecked(): void {
    // Validate image dimensions once a previewUrl is set
    this.files().forEach(mf => {
      if (!mf.isImage || !mf.previewUrl || mf.uploadStatus !== 'idle') return;
      const imgEl = document.getElementById(`preview-${mf.id}`) as HTMLImageElement | null;
      if (!imgEl || imgEl.dataset['validated']) return;
      imgEl.dataset['validated'] = '1';
      imgEl.onload = () => {
        if (
          imgEl.naturalWidth > this.maxWidth() ||
          imgEl.naturalHeight > this.maxHeight()
        ) {
          this.hotToast.error(
            `Max size is ${this.maxWidth()}×${this.maxHeight()} px`
          );
          this.removeFile(mf.id);
        }
      };
    });
  }

  // ── File selection ────────────────────────────────────────────────────────────

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.addFiles(Array.from(input.files));
    // reset so same file can be re-added after removal
    input.value = '';
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  handleDragLeave(): void { this.isDragOver.set(false); }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    if (event.dataTransfer?.files?.length) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  private addFiles(rawFiles: File[]): void {
    const newEntries: ManagedFile[] = [];

    for (const file of rawFiles) {
      if (file.size > this.maxFileSizeInBytes()) {
        this.hotToast.error(`"${file.name}" exceeds max size of ${formatSize(this.maxFileSizeInBytes())}`);
        continue;
      }
      const detectedType = detectType(file);
      if (detectedType === 'unknown') {
        this.hotToast.error(`"${file.name}" — unsupported file type.`);
        continue;
      }
      const isImage = detectedType === 'image';
      const entry: ManagedFile = {
        id: ++managedFileId,
        file,
        name: file.name,
        size: formatSize(file.size),
        detectedType,
        isImage,
        previewUrl: isImage ? URL.createObjectURL(file) : null,
        progress: '0%',
        uploadStatus: 'idle',
        errorMessage: '',
        resultUrl: '',
      };
      newEntries.push(entry);
    }

    if (newEntries.length) {
      this.files.update(prev => [...prev, ...newEntries]);
    }
  }

  removeFile(id: number): void {
    this.files.update(prev => {
      const target = prev.find(f => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(f => f.id !== id);
    });
  }

  // ── Upload ────────────────────────────────────────────────────────────────────

  upload(id: number): void {
    const mf = this.files().find(f => f.id === id);
    if (!mf || mf.uploadStatus === 'uploading') return;

    this._mutate(id, { uploadStatus: 'uploading', progress: '0%', errorMessage: '' });
    this.uploadInProgress.emit(true);

    const form = new FormData();
    const companyName = this.storeDataService.SELECTED_COMPANY()?.companyName ?? '';
    const payloadId = String(this.payload()['id'] ?? '');

    if (mf.detectedType === 'image') {
      form.append('id', payloadId);
      form.append('imageName', String(this.payload()['imageName'] ?? 'HotJobLogo'));
      form.append('Image', mf.file, mf.name);
      form.append('CompanyName', companyName);
      form.append('IsHotJobs', 'true');
    } else {
      form.append('id', payloadId);
      form.append('CompanyName', companyName);
      form.append('File', mf.file, mf.name);
    }

    const url = mf.isImage ? this.imgUrl() : this.fileUploadUrl();
    type R = UploadImgApiResponse | UploadHtmlResponse;

    this.http.post<R>(url, form, { reportProgress: true, observe: 'events' })
      .pipe(
        tap(event => {
          if (
            event.type === HttpEventType.UploadProgress &&
            event.loaded != null && event.total != null && event.total > 0
          ) {
            const pct = `${Math.round((100 * event.loaded) / event.total)}%`;
            this._mutate(id, { progress: pct });
          }
        }),
        filter(event => event.type === HttpEventType.Response),
        map(event => (event as HttpResponse<R>).body),
        this.hotToast.observe({
          loading: `Uploading ${mf.name}…`,
          success: `${mf.name} uploaded!`,
          error: `Failed to upload ${mf.name}`,
        })
      )
      .subscribe({
        next: res => {
          if (!res) return;
          this.ngZone.run(() => {
            let resultUrl = '';
            if (mf.detectedType === 'image') {
              const r = res as UploadImgApiResponse;
              resultUrl = r.profile ?? r.id ?? '';
              this.response.emit(r);
            } else {
              const r = res as UploadHtmlResponse;
              resultUrl = r.publicUrl ?? r.id ?? '';
              this.responseHtmlUp.emit(r);
            }
            this._mutate(id, { uploadStatus: 'done', progress: '100%', resultUrl });
            this.uploadInProgress.emit(this.anyUploading());
          });
        },
        error: err => {
          this._mutate(id, {
            uploadStatus: 'error',
            errorMessage: err.error?.message ?? 'Upload failed',
          });
          this.uploadInProgress.emit(this.anyUploading());
        },
      });
  }

  uploadAll(): void {
    this.files()
      .filter(f => f.uploadStatus === 'idle')
      .forEach(f => this.upload(f.id));
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  /** Immutably patch a single ManagedFile by id */
  private _mutate(id: number, patch: Partial<ManagedFile>): void {
    this.files.update(prev =>
      prev.map(f => f.id === id ? { ...f, ...patch } : f)
    );
  }

  typeIcon(type: DetectedFileType): string {
    const map: Record<DetectedFileType, string> = {
      image: 'ph ph-image',
      pdf: 'ph ph-file-pdf',
      zip: 'ph ph-file-zip',
      html: 'ph ph-file-html',
      unknown: 'ph ph-file',
    };
    return map[type];
  }

  typeBadgeClass(type: DetectedFileType): string {
    const map: Record<DetectedFileType, string> = {
      image: 'bg-blue-100 text-blue-700',
      pdf: 'bg-red-100 text-red-700',
      zip: 'bg-yellow-100 text-yellow-700',
      html: 'bg-green-100 text-green-700',
      unknown: 'bg-gray-100 text-gray-700',
    };
    return map[type];
  }

  hasIdleFiles = computed(() => this.files().some(f => f.uploadStatus === 'idle'));
}