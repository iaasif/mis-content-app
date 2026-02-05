import { Component, EventEmitter } from '@angular/core';
import { FileUploadComponent } from "../../../../../shared/components/file-upload/file-upload.component";

@Component({
  selector: 'app-upload-file',
  imports: [FileUploadComponent],
  templateUrl: './upload-file.html',
  styleUrl: './upload-file.css',
})
export class UploadFile {

  x :Record<string, string | File | undefined> ={
    'id': 'asif',
    'ImageName':"HotJobLogo",
    'Image':this.selectedFile
  }

  selectedFile?: File;
  handleFileSelect(file: File) {
    console.log('Got file from child:', file);
  
    // store it
    this.selectedFile = file;
  
    // or call upload / API
    // this.upload(file);
    console.log("fff-->",this.selectedFile)
  }
  
  
}
