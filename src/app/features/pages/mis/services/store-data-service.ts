import { Injectable, signal } from '@angular/core';
import { CompanySuggestion, UploadHtmlResponse, Variant } from '../models/jobs.data';

@Injectable({
  providedIn: 'root',
})
export class StoreDataService {
  imgUrls = signal<Variant[]>([]);
  fileUploadUrls = signal<UploadHtmlResponse[]>([]);
  pdfUrls = signal<UploadHtmlResponse[]>([]);   // ← add
  zipUrls = signal<UploadHtmlResponse[]>([]);   // ← add

  SELECTED_COMPANY = signal<CompanySuggestion | null>(null);

  storeImgData(data: Variant[]) {
    this.imgUrls.update(prev => [...prev, ...data]);
  }

  storeHtmlData(data: UploadHtmlResponse) {
    this.fileUploadUrls.update(prev => [...prev, data]);
  }

  storePdfData(data: UploadHtmlResponse) {       // ← add
    this.pdfUrls.update(prev => [...prev, data]);
  }

  storeZipData(data: UploadHtmlResponse) {       // ← add
    this.zipUrls.update(prev => [...prev, data]);
  }
}