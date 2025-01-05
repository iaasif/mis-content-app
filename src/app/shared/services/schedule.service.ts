import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/response';
import { ScheduleDelete, ScheduleGet } from '../../features/schedules/models/schedule-info.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  reqUrl: string = environment.baseUrl + 'recruitmentcenter/api/Schedule/';

  getScheduleData(jobId: number, activityNo: number, scheduleId: number): Observable<ApiResponse<ScheduleGet[]>> {

    const params = new HttpParams()
    .set('JobId', jobId)
    .set('ActivityNo', activityNo)
    .set('ScheduleId', scheduleId);

    const url = this.reqUrl + 'GetScheduleData';
    return this.http.get(url, {params});
  }

  setOrUpdateSchedule(body: any): Observable<ApiResponse<any>> {
    const url = this.reqUrl + 'ScheduleCreateUpdate';
    return this.http.post(url, body);
  }

  deleteSchedule(body: ScheduleDelete): Observable<ApiResponse<any>> {
    const url = this.reqUrl + 'ScheduleDelete';
    return this.http.post(url ,body);
  }

}
