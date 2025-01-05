import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { OnlineTestInfoForm, OnlineTestInformationGet,  } from '../models/online-test';
import { ApiResponse } from '../models/response';
import { DeleteQuestionRequest, Question, QuestionDetailsPayload, QustionSetRes, TakeConcernRequest } from '../../features/online-test/models/online-test.model';

@Injectable({
  providedIn: 'root',
})
export class OnlineTestService {
  constructor(private http: HttpClient) {}

  reqUrl: string = environment.baseUrl + 'recruitmentcenter/api/OnlineTest/';

  setMcq(body: any): Observable<ApiResponse<QustionSetRes>> {
    const url = this.reqUrl + 'SetMcq';
    return this.http.post<ApiResponse<QustionSetRes>>(url, body)
      .pipe(
        catchError(err => of({}) as Observable<ApiResponse<QustionSetRes>>)
      )
  }

  deleteQuestions(body: DeleteQuestionRequest): Observable<ApiResponse<any>> {
    const url = this.reqUrl + 'DeleteQuestions';
    return this.http.post(url, body);
  }
  takeConcern(body: TakeConcernRequest): Observable<ApiResponse<any>> {
    const url = this.reqUrl + 'TakeConcern';
    return this.http.post(url, body);
  }
  saveInformation(body: any): Observable<ApiResponse<SaveInfoResponse>> {
    const url = this.reqUrl + 'SaveInformation';
    return this.http.post(url, body);
  }
  onlineTestDashboardFeedback(body: any): Observable<ApiResponse<any>> {
    const url = this.reqUrl + 'OnlineTestDashboardFeedback';
    return this.http.post(url, body);
  }
  onlineTestDashboardInit(body: any): Observable<ApiResponse<any>> {
    const url = this.reqUrl + 'OnlineTestDashboardInit';
    return this.http.post(url, body);
  }
  onlineTestDashboardParticipantLocation(body: any): Observable<ApiResponse<any>> {
    const url = this.reqUrl + 'OnlineTestDashboardParticipantLocation';
    return this.http.post(url, body);
  }
  onlinetestQuestionImgDelete(body: any): Observable<ApiResponse<any>> {
    const url = this.reqUrl + 'OnlinetestQuestionImgDelete';
    return this.http.post(url, body);
  }

  getQuestionDetails(payload: QuestionDetailsPayload): Observable<Question>{
    return this.http.get<ApiResponse<Question>>(this.reqUrl + 'GetQuestionDetails', {params: payload as any})
    .pipe(
      map(res => res.data as Question),
      map(data => {
        return {
          ...data,
          questionInfo: data.questionInfo.map((q, i) => {
            return {
              ...q,
              questionSerialNo: i+1
            }
          })
        }
      })
    )
  }

  testInformationGet(jobId: number, activityNo: number): Observable<ApiResponse<OnlineTestInformationGet>> {
    const params = new HttpParams()
    .set('jobid', jobId)
    .set('activityno', activityNo)

    const url = this.reqUrl + 'GetOnlineTestDetails';
    return this.http.get(url, {params});
  }

  questionsUploadExcel(body:any):Observable<any>{
    return this.http.post("https://onlinetest.bdjobs.com/OnlineTest_MCQUpload/UploadExcel", body)
  }
}

export interface SaveInfoResponse {
  exmid: string;
  scheduleavail: string;
  slotId: boolean;
}
