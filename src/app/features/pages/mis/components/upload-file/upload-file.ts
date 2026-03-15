import { COMPANY_NAME, UploadFileType } from './../../utils/mis.data';
import { Component, computed, inject, signal } from '@angular/core';
import { FileUploadComponent } from "../../../../../shared/components/file-upload/file-upload.component";
import { TextFiled } from "../../../../../shared/components/text-filed/text-filed";
import { UploadHtmlResponse, UploadImgApiResponse, Variant } from '../../models/jobs.data';
import { StoreDataService } from '../../services/store-data-service';

@Component({
  selector: 'app-upload-file',
  imports: [FileUploadComponent, TextFiled],
  templateUrl: './upload-file.html',
  styleUrl: './upload-file.css',
})
export class UploadFile {
  readonly uploadFileType = UploadFileType;

  storeDataService = inject(StoreDataService);
  imageResponse = signal<UploadImgApiResponse | null>(null);
  htmlResponse = signal<UploadHtmlResponse | null>(null);
  linkList = signal<Variant[]>([]);
  readonly companyName = COMPANY_NAME;
  showUploadZip = signal<UploadFileType>(this.uploadFileType.html);
  showUploadZipInnerText= signal<string>('Upload ZIP/PDF');
  readonly imageApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/resize-store';
  readonly htmlApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/upload-html';

  readonly isCompanySelected = computed(() => COMPANY_NAME().trim().length > 0);

  readonly imagePayload = computed<Record<string, string | File | undefined>>(() => ({
    id: 'idfromPayloadIMG',
    imageName: 'HotJobLogo',
    CompanyName: COMPANY_NAME(),
  }));

  readonly htmlPayload = computed<Record<string, string | File | undefined>>(() => ({
    id: 'idformPayloadHTML',
    CompanyName: COMPANY_NAME(),
  }));



  onImageResponse(res: UploadImgApiResponse): void {
    console.log('img ',res)
    this.imageResponse.set(res);
    const variants = res.variants ?? [];
    this.linkList.set(variants);
    this.storeDataService.storeImgData(variants);
  }

  onHtmlResponse(res: UploadHtmlResponse): void {
    console.log('html ',res)
    this.htmlResponse.set(res);
    this.storeDataService.storeHtmlData(res);
  }
  // [attr.inert] = "companyName().length === 0 ? '' : null"
  
  toggleUploadZip():void{
    console.log('toggleUploadZip',this.isCompanySelected());
    this.showUploadZip.set(this.showUploadZip() === this.uploadFileType.html ? this.uploadFileType.zip : this.uploadFileType.html);
    this.showUploadZipInnerText.set(this.showUploadZip() === this.uploadFileType.html ? 'Upload ZIP/PDF' : 'Upload HTML');
  }
}
