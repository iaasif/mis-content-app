import { Component } from '@angular/core';
import { FileUploadComponent } from "../../../../../shared/components/file-upload/file-upload.component";

@Component({
  selector: 'app-upload-file',
  imports: [FileUploadComponent],
  templateUrl: './upload-file.html',
  styleUrl: './upload-file.css',
})
export class UploadFile {
  x :Record<string,string> ={
    'name': 'asif'
  }
}
