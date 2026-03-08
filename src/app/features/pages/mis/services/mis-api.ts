import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form } from '@angular/forms';
import { CreateCompany } from '../models/jobs.data';

@Injectable({
  providedIn: 'root',
})
export class MisApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://contentapi.bdjobs.com/api/hotjobs';

  addCompany(payload: CreateCompany): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/add-company`, payload);
  }
}