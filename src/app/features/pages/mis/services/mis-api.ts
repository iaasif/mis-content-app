import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateCompany, HotJob, HotJobCreationResponse, postedBy, SourcePerson } from '../models/jobs.data';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MisApi {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl + 'hotjobs';


  addCompany(payload: CreateCompany): Observable<unknown> {
    return this.http.post(`${this.url}/add-company`, payload);
  }

  deleteCompany(companyId: number): Observable<unknown> {
    const cpid = companyId.toString()
    return this.http.delete(`${this.url}/delete-company?ComId=${cpid}`);
  }

  getSourcePersons(): Observable<SourcePerson[]>{
    return this.http.get<SourcePerson[]>(environment.apiUrl+"SourcePerson");
  }

  getPostedBy(deptId:number):Observable<postedBy[]>{
    return this.http.get<postedBy[]>(`${environment.apiUrl+"SourcePerson/"+deptId}`)
  }

  //work later
  addHotJob(payload: any): Observable<HotJobCreationResponse>{
    return this.http.post<HotJobCreationResponse>(`${environment.apiUrl} hotjobs/add-hotjob`,payload)
  }

  getAllHotJobs():Observable<HotJob[]>{
    return this.http.get<HotJob[]>(`${environment.apiUrl}hotjobs/all-hotjobs`)
  }

  reOrderHotJobs(body:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}hotjobs/reorder-hotjob`,body)
  }

  /**
   * Optional dates: omit query params when null so the API can treat them as unset.
   */
  getCompanyHotJobs(payload: {
    companyId: number;
    jobType?: string | null;
    fromDate?: unknown;
    toDate?: unknown;
  }): Observable<unknown> {
    let params = new HttpParams().set(
      'companyId',
      String(payload.companyId ?? 0)
    );
    const jt = payload.jobType?.trim();
    if (jt) {
      params = params.set('jobType', jt);
    }
    const from = MisApi.formatDateForQuery(payload.fromDate);
    const to = MisApi.formatDateForQuery(payload.toDate);
    if (from !== undefined) {
      params = params.set('fromDate', from);
    }
    if (to !== undefined) {
      params = params.set('toDate', to);
    }
    return this.http.get<unknown>(
      `${environment.apiUrl}hotjobs/companyHotJobs`,
      { params }
    );
  }

  /** ngxsmk single mode uses `Date`; range mode uses `{ start, end }`. */
  private static formatDateForQuery(value: unknown): string | undefined {
    if (value == null) {
      return undefined;
    }
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    if (typeof value === 'object' && value !== null && 'start' in value) {
      const start = (value as { start: Date | null }).start;
      if (start instanceof Date) {
        return start.toISOString().slice(0, 10);
      }
    }
    return undefined;
  }

}