import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewChecked, Component, ElementRef, EventEmitter, inject, NgZone, OnChanges, Output, signal, SimpleChanges, viewChild, input, output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { filter, map, tap } from 'rxjs/operators';
import { UploadHtmlResponse, UploadImgApiResponse } from '../../../features/pages/mis/models/jobs.data';
import { COMPANY_NAME, UploadFileType } from '../../../features/pages/mis/utils/mis.data';
import { HotToastService } from '@ngxpert/hot-toast';

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

  private readonly imageApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/resize-store';
  private readonly htmlApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/upload-html';

  private apiUrl(): string {
    return this.uploadFileType() === 'html' ? this.htmlApiUrl : this.imageApiUrl;
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
    const lightRedToast = { toastClass: 'ngx-toastr light-red-toast' };
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
    // Use inputFile when provided (e.g. from drop); otherwise use file input (e.g. from browse)
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

    // Decide if it is an image or not
    // If it's in allowedMimeTypes => currently used for Excel

    if (this.allowedMimeTypes.includes(this.file.type)) {

      this.isImage.update(() => false);
    } else {
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

  // upload2() {
  //   if (this.file instanceof File) {
  //     this.toggleUploadProgress(true);
  //     const formData = new FormData();

  //     formData.append('ImgFile', this.file);
  //     const propKeys = Object.keys(this.payload());
  //     if (propKeys.length) {
  //       for (let index = 0; index < propKeys.length; index++) {
  //         const key = propKeys[index];
  //         formData.append(key, this.payload()[key] as string);
  //       }
  //     }
  //     // previous link 'https://exam1.bdjobs.com/ExamImages/Corporate/Test_Img_Saving-tst.aspx',
  //     const xhr = new XMLHttpRequest();
  //     xhr.open(
  //       'POST',
  //       'https://exam1.bdjobs.com/ExamImages/Corporate/Test_Img_Saving-tst.aspx',
  //       true
  //     );

  //     xhr.onreadystatechange = () => {
  //       if (xhr.readyState === XMLHttpRequest.DONE) {
  //         if (xhr.status === 200 || xhr.status === 201) {
  //           this.uploadResult = 'Uploaded';
  //           this.isPreview.update(() => false);
  //           const url = `https://exam1.bdjobs.com/ExamImages/Corporate/JID_${this.payload()['hJID']}/${this.payload()['hImgName']}.jpg`;
  //           of(url)
  //             .pipe(delay(1000))
  //             .subscribe({
  //               next: (url) => {
  //                 this.onSuccess.emit(url);
  //                 this.uploadInProgress.emit(false);
  //               },
  //             });
  //         } else if (xhr.status === 400) {
  //           this.uploadResult = JSON.parse(xhr.response)!.message;
  //         } else {
  //           this.uploadResult = 'File upload failed!';
  //         }
  //         this.uploadStatus.update(() => (xhr.status === 0 ? 1 : xhr.status));
  //       }
  //     };

  //     xhr.upload.onprogress = (progressEvent) => {
  //       this.toggleUploadProgress(true);
  //       if (progressEvent.lengthComputable) {
  //         const progress = (progressEvent.loaded / progressEvent.total) * 100;
  //         this.progress.update(() => `${Math.round(progress)}%`);
  //       }
  //     };

  //     xhr.send(formData);
  //   }
  // }
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
      form.append('CompanyName', COMPANY_NAME);
      form.append('File', this.file, this.file.name);
    } else if (type === 'image') {
      form.append('id', String(this.payload()['id'] ?? '877866'));
      form.append('imageName', String(this.payload()['imageName'] ?? 'HotJobLogo'));
      form.append('Image', this.file, this.file.name);
      form.append('CompanyName', COMPANY_NAME);
      form.append('IsHotJobs','true');
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
        this.hotToast.observe({  // ← Now only observes the final response
          loading: 'Please Wait Uploading...',
          success: 'Uploaded!',
          error: 'Could not Uploaded. Try again',
        })
      )
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.ngZone.run(() => {
            if (type === 'html') {
              this.responseHtmlUp.emit(res as UploadHtmlResponse);
            } else if (type === 'image') {
              this.response.emit(res as UploadImgApiResponse);
            }
            this.uploadResult = 'Uploaded';
            this.uploadStatus.set(200);
            this.isPreview.set(false);
            let successValue: string;
            if (type === 'html') {
              const r = res as UploadHtmlResponse;
              successValue = r.publicUrl ?? r.id;
            } else {
              const r = res as UploadImgApiResponse;
              successValue = r.profile ?? r.id;
            }
            this.onSuccess.emit(successValue);
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

  cancel() {
    this.file = null as unknown as File;
    this.isPreview.update(() => false);
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