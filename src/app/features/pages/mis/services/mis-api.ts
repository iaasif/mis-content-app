import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateCompany, HotJob } from '../models/jobs.data';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MisApi {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl + 'hotjobs';


  addCompany(payload: CreateCompany): Observable<unknown> {
    // const formData = new FormData();
    // Object.keys(payload).forEach(key => {
    //   const value = (payload as any)[key];
    //   if (value !== null && value !== undefined) {
    //     formData.append(key, value instanceof Blob ? value : value.toString());
    //   }
    // });


    return this.http.post(`${this.url}/add-company`, payload);
  }

  deleteCompany(companyId: number): Observable<unknown> {
    const cpid = companyId.toString()
    return this.http.delete(`${this.url}/delete-company?ComId=${cpid}`);
  }

  getHotJobs(): Observable<HotJob[]> {
    return this.http.get<HotJob[]>(`${environment.apiUrl}hotjobs`);
  }

}