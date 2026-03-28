import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewChecked, Component, ElementRef, EventEmitter, inject, NgZone, OnChanges, Output, signal, SimpleChanges, viewChild, input, output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { filter, map, tap } from 'rxjs/operators';
import { UploadHtmlResponse, UploadImgApiResponse } from '../../../features/pages/mis/models/jobs.data';
import { UploadFileType } from '../../../features/pages/mis/utils/mis.data';
import { HotToastService } from '@ngxpert/hot-toast';
import { StoreDataService } from '../../../features/pages/mis/services/store-data-service';

export const DefaultMaxSize = 9000000;

let fileInputIdCounter = 0;

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent implements AfterViewChecked, OnChanges {
  private hotToast = inject(HotToastService);
  private storeDataService = inject(StoreDataService);

  /** Unique id for this instance so multiple file-uploads don't share the same input (label for / input id). */
  readonly fileInputId = `app-file-upload-input-${++fileInputIdCounter}`;

  uploadFileType = input<UploadFileType>()

  outputBoxVisible: boolean = false;
  progress = signal<string>('0%');
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus = signal<number | undefined>(undefined);
  isPreview = signal<boolean>(false);
  img = viewChild<ElementRef<HTMLImageElement>>('preview');
  file!: File;
  allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  isImage = signal<boolean>(true);

  readonly fileTypesToLimit = input<string>('');
  readonly maxFileSizeInKb = input(DefaultMaxSize / 1024);
  readonly maxWidth = input.required<number>();
  readonly maxHeight = input.required<number>();
  readonly payload = input.required<Record<string, number | string | File | undefined>>();
  readonly uploadTitle = input<string>('Image Upload');
  readonly uploadIcon = input<string>();
  @Output() onSuccess = new EventEmitter<string>();
  @Output() onFileSelect = new EventEmitter<File>();
  @Output() uploadInProgress = new EventEmitter<boolean>();
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private ngZone = inject(NgZone);
  notes!: string;
  imgUrl = input<string>('');
  fileUploadUrl = input<string>('');

  private apiUrl(): string {
    const type = this.uploadFileType();
    return (type === 'pdf' || type === 'zip' || type === 'html') ? this.fileUploadUrl() : this.imgUrl();
  }

  response = output<UploadImgApiResponse>()
  responseHtmlUp = output<UploadHtmlResponse>()

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileTypesToLimit'] || changes['maxFileSizeInKb'] || changes['maxWidth'] || changes['maxHeight']) {
      this.setValidationsNote(changes);
    }
  }

  ngAfterViewChecked(): void {
    if (!this.isImage()) {
      return;
    }
    if (this.img() instanceof ElementRef) {
      const url = URL.createObjectURL(this.file);
      const img = this.img() as ElementRef<HTMLImageElement>;
      img.nativeElement.src = url;
      img.nativeElement.onload = () => {
        URL.revokeObjectURL(url);
        let width = img.nativeElement.naturalWidth;
        let height = img.nativeElement.naturalHeight;
        const maxWidth = this.maxWidth();
        const maxHeight = this.maxHeight();
        if (maxWidth && maxHeight && (width > maxWidth || height > maxHeight)) {
          this.isPreview.update(() => false);
          this.hotToast.error(`Maximum width is ${maxWidth}px & Maximum height is ${maxHeight}px`);

        }
      };
    }
  }

  private setValidationsNote(changes: SimpleChanges) {
    this.notes = 'Note: ';
    const fileTypesToLimit = this.fileTypesToLimit();
    if (changes['fileTypesToLimit'] && fileTypesToLimit.length) {
      this.notes = this.notes + `Image must be at ${fileTypesToLimit} format.`;
    }
    if (changes['maxFileSizeInKb']) {
      this.notes = this.notes + `Its size will be below ${this.maxFileSizeInKb()} KB. `
    }
    if (changes['maxWidth'] && changes['maxHeight']) {
      this.notes += `width & height can be maximum ${this.maxWidth()} x ${this.maxHeight()} pixels.`
    }
  }

  private static readonly HTML_EXTENSIONS = ['html'];
  private static readonly IMAGE_EXTENSIONS = ['img', 'png', 'jpg', 'jpeg'];
  private static readonly PDF_EXTENSIONS = ['pdf'];
  private static readonly ZIP_EXTENSIONS = ['zip'];

  private checkFileValidation(file: File) {
    if (!file) {
      this.hotToast.error("Please select a file");
      return false;
    }
    if ((file.size / 1024) > this.maxFileSizeInKb()) {
      this.hotToast.error("File size is too Big");
      return false;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const type = this.uploadFileType();

    if (type === 'html') {
      if (!FileUploadComponent.HTML_EXTENSIONS.includes(ext)) {
        this.hotToast.error('Please upload a valid html!');
        return false;
      }
    } else if (type === 'image') {
      if (!FileUploadComponent.IMAGE_EXTENSIONS.includes(ext)) {
        this.hotToast.error('Please upload a valid img file!');
        return false;
      }
    } else if (type === 'pdf') {
      if (!FileUploadComponent.PDF_EXTENSIONS.includes(ext)) {
        this.hotToast.error('Please upload a valid PDF file!');
        return false;
      }
    } else if (type === 'zip') {
      if (!FileUploadComponent.ZIP_EXTENSIONS.includes(ext)) {
        this.hotToast.error('Please upload a valid ZIP file!');
        return false;
      }
    }

    const fileNames = file.name.split('.');
    const fileTypesToLimit = this.fileTypesToLimit();
    if (fileTypesToLimit.length && !fileTypesToLimit.includes(fileNames[fileNames.length - 1])) {
      this.hotToast.error(`Please select ${fileTypesToLimit}`);
      return false;
    }

    return true;
  }

  onFileSelected(event: any, inputFile: File | null) {
    const selectedFile = inputFile ?? event.target?.files?.[0];
    if (!this.checkFileValidation(selectedFile)) {
      return;
    }

    this.outputBoxVisible = false;
    this.uploadResult = '';
    this.fileName = '';
    this.fileSize = '';

    this.file = selectedFile;
    this.fileName = this.file.name;
    this.fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;

    const type = this.uploadFileType();

    if (this.allowedMimeTypes.includes(this.file.type) || type === 'pdf' || type === 'zip') {
      // Excel, PDF, ZIP — no image preview
      this.isImage.update(() => false);
      this.isPreview.update(() => false);
    } else {
      // Images and HTML — show preview
      this.isPreview.update(() => true);
    }

    this.onFileSelect.emit(this.file);
  }

  getBase64(file: File) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
    };
  }

  toggleUploadProgress(isVisible: boolean) {
    this.outputBoxVisible = isVisible;
    this.uploadInProgress.emit(isVisible);
  }

  /** The file is sent in the request body as FormData (headers cannot contain binary data). */
  upload() {
  if (!this.file) return;
  if (!this.checkFileValidation(this.file)) return;
  this.toggleUploadProgress(true);
  this.progress.set('0%');
  const form = new FormData();
  const type = this.uploadFileType();

  if (type === 'html') {
    form.append('id', String(this.payload()['id'] ?? '877866'));
    form.append('CompanyName', this.storeDataService.SELECTED_COMPANY()?.companyName ?? '');
    form.append('File', this.file, this.file.name);
  } else if (type === 'image') {
    form.append('id', String(this.payload()['id'] ?? '877866'));
    form.append('imageName', String(this.payload()['imageName'] ?? 'HotJobLogo'));
    form.append('Image', this.file, this.file.name);
    form.append('CompanyName', this.storeDataService.SELECTED_COMPANY()?.companyName ?? '');
    form.append('IsHotJobs', 'true');
  } else if (type === 'pdf' || type === 'zip') {
    form.append('id', String(this.payload()['id'] ?? '877866'));
    form.append('CompanyName', this.storeDataService.SELECTED_COMPANY()?.companyName ?? '');
    form.append('File', this.file, this.file.name);
  }

  type ResponseType = UploadImgApiResponse | UploadHtmlResponse;

  this.http
    .post<ResponseType>(this.apiUrl(), form, {
      reportProgress: true,
      observe: 'events',
    })
    .pipe(
      tap((event) => {
        if (
          event.type === HttpEventType.UploadProgress &&
          event.loaded != null &&
          event.total != null &&
          event.total > 0
        ) {
          this.progress.set(
            `${Math.round((100 * event.loaded) / event.total)}%`
          );
        }
      }),
      filter((event) => event.type === HttpEventType.Response),
      map((event) => (event as HttpResponse<ResponseType>).body),
      this.hotToast.observe({
        loading: 'Please Wait Uploading...',
        success: 'Uploaded!',
        error: 'Could not Uploaded. Try again',
      })
    )
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.ngZone.run(() => {
            let successValue: string;
            if (type === 'html') {
              this.responseHtmlUp.emit(res as UploadHtmlResponse);
              const r = res as UploadHtmlResponse;
              successValue = r.publicUrl ?? r.id;
            } else if (type === 'image') {
              this.response.emit(res as UploadImgApiResponse);
              const r = res as UploadImgApiResponse;
              successValue = r.profile ?? r.id;
            } else if (type === 'pdf' || type === 'zip') {
              this.responseHtmlUp.emit(res as UploadHtmlResponse);
              const r = res as UploadHtmlResponse;
              successValue = r.publicUrl ?? r.id;
            } else {
              successValue = '';
            }
        
            this.onSuccess.emit(successValue);
        
            // ✅ Full reset — same as cancel() so next upload starts clean
            this.file = null as unknown as File;
            this.isPreview.set(false);
            this.isImage.set(true);
            this.uploadStatus.set(undefined);
            this.uploadResult = '';
            this.fileName = '';
            this.fileSize = '';
            this.progress.set('0%');
            this.toggleUploadProgress(false);
          });
        },
        error: (err) => {
          this.uploadResult = err.error?.message ?? 'File upload failed!';
          this.uploadStatus.set(err.status ?? 500);
          this.toggleUploadProgress(false);
        },
      });
  }

  // cancel() {
  //   this.file = null as unknown as File;
  //   this.isPreview.update(() => false);
  //   this.toggleUploadProgress(false);
  // }
  cancel() {
    this.file = null as unknown as File;
    this.isPreview.set(false);
    this.isImage.set(true); // ✅ reset so drop zone shows again on cancel
    this.uploadStatus.set(undefined);
    this.uploadResult = '';
    this.fileName = '';
    this.fileSize = '';
    this.toggleUploadProgress(false);
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files?.length) {
      this.onFileSelected(event, event.dataTransfer.files[0]);
    }
  }
}