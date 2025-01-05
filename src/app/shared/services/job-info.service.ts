import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobDeadlineUpdate, JobInfoApiResponse, MessageData, MessageCount } from '../../features/job-title/models/job-info.model';
import { LocalstorageService } from '../../core/services/essentials/localstorage.service';
import { CompanyIdLocalStorage } from '../enums/app.enums';
import { ApiResponse } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class JobInfoService {
  protected jobInfo!: JobInfoApiResponse;
  constructor(private http: HttpClient, private localStorageService: LocalstorageService) {}

  getJobInformation(jobId: number): Observable<JobInfoApiResponse> {
    if (!this.jobInfo) {
      const params = new HttpParams()
        .set('JobId', jobId)
        .set('CompanyID', this.localStorageService.getItem(CompanyIdLocalStorage));

      const url =
        environment.baseUrl +
        'recruitmentcenter/api/ApplicantHeaderInfo/GetJobInfo';
      return this.http
        .get<JobInfoApiResponse>(url, { params })
        .pipe(
          tap((response: JobInfoApiResponse) => (this.jobInfo = response))
        );
    }

    return of(this.jobInfo);
  }

  getJobInfo() {
    return this.jobInfo;
  }

   
   updateJobDeadline(jobDeadlineUpdate: JobDeadlineUpdate): Observable<ApiResponse<JobInfoApiResponse>> {
    const url = `${environment.baseUrl}recruitmentcenter/api/ApplicantHeaderInfo/JobDeadline`;
    
    return this.http.put(url, jobDeadlineUpdate).pipe(
      tap(() => {
        console.log('Job deadline updated successfully');
      })
    );
  }


  messageBox( companyId: string,
    jobNo: string,
    readType: string,
    fromHiringActivity: number): Observable<ApiResponse<MessageData>> {
    const url = `${environment.baseUrl}/recruitmentcenter/API/EmployerMessage/ConversationInfoDetails`;
    const params = new HttpParams()
    .set('CompanyId', companyId)
    .set('JobNo', jobNo)
    .set('ReadType', readType)
    .set('FromHiringActivity', fromHiringActivity.toString());
    return this.http.get<ApiResponse<MessageData>>(url, { params });
  }


  MessageCount(jobId: string, chatAfter: string): Observable<ApiResponse<MessageCount>> {
    const url = `${environment.baseUrl}/recruitmentcenter/API/EmployerMessage/UnreadMessageCount`;
    
    const params = new HttpParams()
      .set('JobId', jobId)
      .set('ChatAfter', chatAfter);
   
      return this.http.get<ApiResponse<MessageCount>>(url, { params });
  }

  MessageCountUpdate(jobId: string): Observable<ApiResponse<any>> {
    const url = `${environment.baseUrl}/recruitmentcenter/API/EmployerMessage/UpdateNotification`;

    // Create the request payload with jobId
    const body = {
        jobId: jobId
    };

    // Send the HTTP POST request
    return this.http.post<ApiResponse<any>>(url, body);
}
  


}
