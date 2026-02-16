import { COMPANY_NAME, UploadFileType } from './../../utils/mis.data';
import { Component, signal } from '@angular/core';
import { FileUploadComponent } from "../../../../../shared/components/file-upload/file-upload.component";
import { TextFiled } from "../../../../../shared/components/text-filed/text-filed";
import { UploadHtmlResponse, UploadImgApiResponse, Variant } from '../../models/jobs.data';

@Component({
  selector: 'app-upload-file',
  imports: [FileUploadComponent, TextFiled],
  templateUrl: './upload-file.html',
  styleUrl: './upload-file.css',
})
export class UploadFile {
  readonly uploadFileType = UploadFileType;
  readonly imageApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/resize-store';
  readonly htmlApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/upload-html';

  readonly imagePayload: Record<string, string | File | undefined> = {
    id: 'idfromPayloadIMG',
    imageName: 'HotJobLogo',
    CompanyName: COMPANY_NAME,
  };

  readonly htmlPayload: Record<string, string | File | undefined> = {
    id: 'idformPayloadHTML',
    CompanyName: COMPANY_NAME,
  };

  imageResponse = signal<UploadImgApiResponse | null>(null);
  htmlResponse = signal<UploadHtmlResponse | null>(null);
  linkList = signal<Variant[]>([]);

  onImageResponse(res: UploadImgApiResponse): void {
    this.imageResponse.set(res);
    this.linkList.set(res.variants ?? []);
  }

  onHtmlResponse(res: UploadHtmlResponse): void {
    this.htmlResponse.set(res);
  }
}
