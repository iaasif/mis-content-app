import { Component, computed, inject, signal } from '@angular/core';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { TextFiled } from '../../../../../shared/components/text-filed/text-filed';
import { UploadHtmlResponse, UploadImgApiResponse, Variant } from '../../models/jobs.data';
import { StoreDataService } from '../../services/store-data-service';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [FileUploadComponent, TextFiled],
  templateUrl: './upload-file.html',
  styleUrl: './upload-file.css',
})
export class UploadFile {

  readonly storeDataService = inject(StoreDataService);

  // ── API URLs ─────────────────────────────────────────────────────────────────
  readonly imageApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/resize-store';
  readonly fileUploadApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/upload-file';

  // ── Guard ────────────────────────────────────────────────────────────────────
  readonly isCompanySelected = computed(() => this.storeDataService.SELECTED_COMPANY() != null);

  // ── Shared payload (id + company resolved from store) ────────────────────────
  readonly sharedPayload = computed<Record<string, string | number | undefined>>(() => ({
    id: this.storeDataService.SELECTED_COMPANY()?.comId ?? '',
    imageName: 'HotJobLogo',
    CompanyName: this.storeDataService.SELECTED_COMPANY()?.companyName,
  }));

  // ── Response handlers ────────────────────────────────────────────────────────

  onImageResponse(res: UploadImgApiResponse): void {
    const variants = res.variants ?? [];
    this.storeDataService.storeImgData(variants);
  }

  onHtmlResponse(res: UploadHtmlResponse): void {
    this.storeDataService.storeHtmlData(res);
  }

  // ── Grouped result links ──────────────────────────────────────────────────────

  /** All image CDN links from store */
  readonly imageLinks = computed(() => this.storeDataService.imgUrls());

  /** All file (html/pdf/zip) public URLs from store */
  readonly fileLinks = computed(() => this.storeDataService.fileUploadUrls());

  readonly hasAnyResults = computed(() =>
    this.imageLinks().length > 0 || this.fileLinks().length > 0
  );
}