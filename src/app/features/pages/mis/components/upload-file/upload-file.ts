
import { Component, computed, inject, signal } from '@angular/core';
import { FileUploadComponent } from "../../../../../shared/components/file-upload/file-upload.component";
import { TextFiled } from "../../../../../shared/components/text-filed/text-filed";
import { UploadHtmlResponse, UploadImgApiResponse, Variant } from '../../models/jobs.data';
import { StoreDataService } from '../../services/store-data-service';
import { UploadFileType } from '../../utils/mis.data';

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
  readonly companyName = computed(() => this.storeDataService.SELECTED_COMPANY());
  showUploadZip = signal<UploadFileType>(this.uploadFileType.html);
  showUploadZipInnerText = signal<string>('Upload ZIP/PDF');
  readonly imageApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/resize-store';
  readonly fileUploadApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/upload-file';

  readonly isCompanySelected = computed(() => this.storeDataService.SELECTED_COMPANY() != null);

  readonly imagePayload = computed<Record<string, string | File | undefined>>(() => ({
    id: 'idfromPayloadIMG',
    imageName: 'HotJobLogo',
    CompanyName: this.storeDataService.SELECTED_COMPANY()?.companyName,
  }));

  readonly htmlPayload = computed<Record<string, string | File | undefined>>(() => ({
    id: this.storeDataService.SELECTED_COMPANY()?.id?.toString(),
    CompanyName: this.storeDataService.SELECTED_COMPANY()?.companyName,
  }));



  onImageResponse(res: UploadImgApiResponse): void {
    console.log('img ', res)
    this.imageResponse.set(res);
    const variants = res.variants ?? [];
    this.linkList.set(variants);
    this.storeDataService.storeImgData(variants);
  }

  onHtmlResponse(res: UploadHtmlResponse): void {
    console.log('html ', res)
    this.htmlResponse.set(res);
    this.storeDataService.storeHtmlData(res);
  }
  // [attr.inert] = "companyName().length === 0 ? '' : null"

  toggleUploadZip(): void {
    console.log('toggleUploadZip', this.isCompanySelected());
    this.showUploadZip.set(this.showUploadZip() === this.uploadFileType.html ? this.uploadFileType.zip : this.uploadFileType.html);
    this.showUploadZipInnerText.set(this.showUploadZip() === this.uploadFileType.html ? 'Upload ZIP/PDF' : 'Upload HTML');
  }

  onPdfResponse(res: UploadHtmlResponse): void {
    console.log('pdf ', res);
    this.storeDataService.storePdfData(res);
  }

  onZipResponse(res: UploadHtmlResponse): void {
    console.log('zip ', res);
    this.storeDataService.storeZipData(res);
  }
}
