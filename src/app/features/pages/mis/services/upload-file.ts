import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImgPayload, UploadImgApiResponse } from '../models/jobs.data';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {

  http = inject(HttpClient);
  apiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/resize-store';

  uploadImg(payload: ImgPayload): Observable<UploadImgApiResponse> {
    const form = new FormData();
    form.append('id', payload.id);
    form.append('imageName', payload.ImageName);
    form.append('Image', payload.Image, payload.Image.name);
    return this.http.post<UploadImgApiResponse>(this.apiUrl, form);
  }
}
