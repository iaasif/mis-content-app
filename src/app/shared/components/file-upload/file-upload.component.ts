import { AfterViewChecked, Component, ElementRef, EventEmitter, inject, Input, OnChanges, Output, output, signal, SimpleChanges, viewChild } from '@angular/core';
import { DefaultMaxSize } from '../../utils/app.const';
import { ToastrService } from 'ngx-toastr';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent implements AfterViewChecked, OnChanges {
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
 
  @Input() fileTypesToLimit: string = '';
  @Input() maxFileSizeInKb = DefaultMaxSize/1024;
  @Input() maxWidth!: number;
  @Input() maxHeight!: number;
  @Input({required: true}) payload: Record<string, number | string | File> = {};
  @Input() uploadTitle: string = 'Image Upload'
  @Output() onSuccess = new EventEmitter<string>();
  @Output() onFileSelect = new EventEmitter<File>();
  @Output() uploadInProgress = new EventEmitter<boolean>();
  private toastr = inject(ToastrService);
  notes!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileTypesToLimit'] || changes['maxFileSizeInKb'] || changes['maxWidth'] || changes['maxHeight']) {
      this.setValidationsNote(changes);
    }
  }
  
  ngAfterViewChecked(): void {
    if(!this.isImage()){
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
        if (this.maxWidth && this.maxHeight && (width > this.maxWidth || height > this.maxHeight)) {
          this.isPreview.update(() => false);
          this.toastr.error(`Maximum width is ${this.maxWidth}px & Maximum height is ${this.maxHeight}px`);
        }
      };
    }
  }

  private setValidationsNote(changes: SimpleChanges) {
    this.notes = 'Note: ';
    if (changes['fileTypesToLimit'] && this.fileTypesToLimit.length) {
      this.notes = this.notes + `Image must be at ${this.fileTypesToLimit} format.`;
    }
    if (changes['maxFileSizeInKb']) {
      this.notes = this.notes + `Its size will be below ${this.maxFileSizeInKb} KB. `
    }
    if (changes['maxWidth'] && changes['maxHeight']) {
      this.notes += `width & height can be maximum ${this.maxWidth} x ${this.maxHeight} pixels.`
    }
  }

  private checkFileValidation(file: File) {
    if (!file) {
      this.toastr.error("Please select a file");
      return false;
    }
    if ((file.size / 1024) > this.maxFileSizeInKb) {
      this.toastr.error("File size is too Big");
      return false;
    }
    let fileNames = file.name.split('.');
    if (this.fileTypesToLimit.length && !this.fileTypesToLimit.includes(fileNames[fileNames.length-1])) {
      this.toastr.error(`Please select ${this.fileTypesToLimit}`);
      return false;
    }

    return true;
  }

  // Handle file selection via input
  onFileSelected(event: any) {
    const selectedFile: File = event.target.files[0];
    if (!this.checkFileValidation(selectedFile)) {
      return;
    }
    this.outputBoxVisible = true;
    this.fileName = selectedFile.name;
    this.fileSize = `${(selectedFile.size / 1024).toFixed(2)} KB`;
    this.onFileSelect.emit(selectedFile);
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


  upload() {
    if (this.file instanceof File) {
      this.toggleUploadProgress(true);
   const formData = new FormData();
      // this.getBase64(this.file);
      
      formData.append('ImgFile',  this.file);
      const propKeys = Object.keys(this.payload);
      if (propKeys.length) {
        for (let index = 0; index < propKeys.length; index++) {
          const key = propKeys[index];
          formData.append(key, this.payload[key] as string);
        }
      }
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://exam1.bdjobs.com/ExamImages/Corporate/Test_Img_Saving-tst.aspx', true);
  
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
         if (xhr.status === 200 || xhr.status === 201) {

            this.uploadResult = 'Uploaded';
            this.isPreview.update(() => false);
            const url = `https://exam1.bdjobs.com/ExamImages/Corporate/JID_${this.payload['hJID']}/${this.payload['hImgName']}.jpg`;
            of(url)
            .pipe(
              delay(1000)
            ).subscribe({
              next: (url) => {
                this.onSuccess.emit(url);
                this.uploadInProgress.emit(false);
              }
            });
          } else if (xhr.status === 400) {
            this.uploadResult = JSON.parse(xhr.response)!.message;
          } else {
            this.uploadResult = 'File upload failed!';
          }
          this.uploadStatus.update(() => xhr.status === 0 ? 1 : xhr.status);
        }
      };
  
      xhr.upload.onprogress = (progressEvent) => {
        this.toggleUploadProgress(true);
        if (progressEvent.lengthComputable) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          this.progress.update(() => `${Math.round(progress)}%`);
        }
      };
  
      xhr.send(formData);
    }
    this.fileName = '';
    this.fileSize = '';
    this.outputBoxVisible = false;
  }


  cancel() {
    this.fileName = '';
    this.fileSize = '';
    this.outputBoxVisible = false;
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (this.checkFileValidation(file)) {
        this.outputBoxVisible = true;
        this.fileName = file.name;
        this.fileSize = `${(file.size / 1024).toFixed(2)} KB`;
        this.onFileSelect.emit(file);
      }
      event.dataTransfer.clearData();
    }
  }
}
