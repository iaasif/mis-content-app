import { Component, signal } from '@angular/core';
import { FileUploadComponent } from "../../../../../shared/components/file-upload/file-upload.component";
import { TextFiled } from "../../../../../shared/components/text-filed/text-filed";
import { UploadApiResponse, Variant } from '../../models/jobs.data';

@Component({
  selector: 'app-upload-file',
  imports: [FileUploadComponent, TextFiled],
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
  uploadResponse=signal<UploadApiResponse | null>(null) 
  linkList = signal<Variant[]>([])

  handleFileSelect(file: File) {
    console.log('Got file from child:', file);
    this.selectedFile = file;
    console.log("fff-->",this.selectedFile)
  }


  getRes(res: UploadApiResponse): void {
    this.uploadResponse.set(res);
    this.linkList.set(this.uploadResponse()!.variants)
    console.log('parent ', this.uploadResponse())
  }
}
