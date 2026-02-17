import { Injectable, signal } from '@angular/core';
import { UploadHtmlResponse, Variant } from '../models/jobs.data';

@Injectable({
  providedIn: 'root',
})
export class StoreDataService {

  imgUrls = signal<Variant[]>([]);
  htmlUrls = signal<UploadHtmlResponse[]>([]);
  
  storeImgData(data:Variant[] ){
    this.imgUrls.update(prev => [...prev, ...data]);
  }

  storeHtmlData(data:UploadHtmlResponse){
    this.htmlUrls.update(prev => [...prev,data]);
  }
} 
