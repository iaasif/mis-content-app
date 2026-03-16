import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateCompany } from '../models/jobs.data';

@Injectable({
  providedIn: 'root',
})
export class MisApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://contentapi.bdjobs.com/api/hotjobs';


  addCompany(payload: CreateCompany): Observable<unknown> {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      const value = (payload as any)[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value instanceof Blob ? value : value.toString());
      }
    });

    return this.http.post(`${this.baseUrl}/add-company`, formData);
  }

  deleteCompany(companyId: number): Observable<unknown> {
    const cpid = companyId.toString()
    return this.http.delete(`${this.baseUrl}/delete-company?ComId=${cpid}`);
  }

}