import { COMPANY_NAME, UploadFileType } from './../../utils/mis.data';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FileUploadComponent } from "../../../../../shared/components/file-upload/file-upload.component";
import { TextFiled } from "../../../../../shared/components/text-filed/text-filed";
import { UploadHtmlResponse, UploadImgApiResponse, Variant } from '../../models/jobs.data';
import { StoreDataService } from '../../services/store-data-service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-upload-file',
  imports: [FileUploadComponent, TextFiled],
  templateUrl: './upload-file.html',
  styleUrl: './upload-file.css',
})
export class UploadFile {
  companyName = signal(COMPANY_NAME);
  private router = inject(Router)
  currentRoute = signal(this.router.url)

  storeDataService = inject(StoreDataService);
 
  readonly uploadFileType = UploadFileType;
  readonly imageApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/resize-store';
  readonly htmlApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/upload-html';
  
  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe((event: NavigationEnd) => {
      console.log('New URL:', event.urlAfterRedirects);
      this.currentRoute.set(event.urlAfterRedirects);
    });
  }

  readonly imagePayload: Record<string, string | File | undefined> = {
    id: 'idfromPayloadIMG',
    imageName: 'HotJobLogo',
    CompanyName: COMPANY_NAME(),
  };

  readonly htmlPayload: Record<string, string | File | undefined> = {
    id: 'idformPayloadHTML',
    CompanyName: COMPANY_NAME(),
  };

  imageResponse = signal<UploadImgApiResponse | null>(null);
  htmlResponse = signal<UploadHtmlResponse | null>(null);
  linkList = signal<Variant[]>([]);

  onImageResponse(res: UploadImgApiResponse): void {
    this.imageResponse.set(res);

    const variants = res.variants ?? []
    ;
    this.linkList.set(variants);
    this.storeDataService.storeImgData(variants);
  }

  onHtmlResponse(res: UploadHtmlResponse): void {
    this.htmlResponse.set(res);
    this.storeDataService.storeHtmlData(res);
  }
  // [attr.inert] = "companyName().length === 0 ? '' : null"
}
