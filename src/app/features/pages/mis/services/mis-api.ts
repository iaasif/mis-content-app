import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyLogoData, CreateCompany, HotJob, HotJobCreationResponse, postedBy, SourcePerson } from '../models/jobs.data';
import { environment } from '../../../../../environments/environment';
import { CompanyHotJobsPayload, CompanyHotJobsResponse } from '../utils/mis.data';

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

  getPostedBy():Observable<postedBy[]>{
    const deptIdParam = "3"
    return this.http.get<postedBy[]>(`${environment.apiUrl+"SourcePerson/"+deptIdParam}`)
  }

  //work later
  addHotJob(payload: any): Observable<HotJobCreationResponse>{
    return this.http.post<HotJobCreationResponse>(`${environment.apiUrl}hotjobs/add-hotjob`,payload)
  }

  getAllHotJobs():Observable<HotJob[]>{
    return this.http.get<HotJob[]>(`${environment.apiUrl}hotjobs/all-hotjobs`)
  }

  reOrderHotJobs(body:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}hotjobs/reorder-hotjob`,body)
  }

  getCompanyHotJobs(payload: CompanyHotJobsPayload): Observable<CompanyHotJobsResponse> {
    let params = new HttpParams().set('CompanyId', payload.companyId);

    if (payload.jobType) {
      params = params.set('JobType', payload.jobType);
    }
    if (payload.fromDate) {
      params = params.set('ValidFromDate', payload.fromDate.toISOString());
    }
    if (payload.toDate) {
      params = params.set('ValidToDate', payload.toDate.toISOString());
    }

    return this.http.get<CompanyHotJobsResponse>(
      `${environment.apiUrl}hotjobs/companyHotJobs`,
      { params }
    );
  }

  getCompanyLogo(comID: string | number): Observable<CompanyLogoData[]> {
    const params = new HttpParams().set('ComId', comID.toString());
    return this.http.get<CompanyLogoData[]>(`${environment.apiUrl}hotjobs/companyLogo`, { params });
  }


  getHotJobDataById(jobId: string | number): Observable<HotJob> {
    const params = new HttpParams().set('Id', jobId.toString());
    return this.http.get<HotJob>(`${environment.apiUrl}hotjobs/single-hotjob`, { params });
  }
  
  updateHotJob(payload: any): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}hotjobs/update-single-hotjob`,payload)
  }
  
  getTotalActiveHotJobsCount(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}hotjobs/total-active-hotjobs-count`)
  }

  getCompanyById(companyId: string | number): Observable<any>{
    const params = new HttpParams().set('CompanyId', companyId.toString());
    return this.http.get<any>(`${environment.apiUrl}hotjobs/single-company`, { params });
  }

  updateCompany(payload: any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}hotjobs/update-company`,payload)
  }

}

