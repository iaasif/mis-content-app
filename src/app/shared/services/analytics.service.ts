import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/response';
import { Observable } from 'rxjs';
import { JobDetails } from '../models/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.baseUrl}/recruitmentcenter/API/AnalyticalReport/JobAnalytics`;
 
  constructor(private http: HttpClient) {}
  
  getJobDetails(jobId: string): Observable<ApiResponse<JobDetails>> {
    return this.http.get<ApiResponse<JobDetails>>(`${this.apiUrl}?jobId=${jobId}`);
  }
}
