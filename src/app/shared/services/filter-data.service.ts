import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/response';

export interface LocationQueryParams {
  searchtext: string;
  isBlueCollar: boolean;
  combineLocation: boolean;
}

export type MajorSubRes = { majSubId: number; majSubName: string }

export type IndustryOrExpertiseResponse = {
  id: number,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class FilterDataService {

  constructor(
    private http: HttpClient
  ) { }
  
  getIndustries(queryParams: any) {
    const url = environment.baseUrl + "recruitmentcenter/API/Filterapplicants/GetIndustryName"
    return this.http.get<ApiResponse<IndustryOrExpertiseResponse[]>>(url, { params: queryParams});
  }
  
  getExpertise(queryParams: any) {
    const url = environment.baseUrl + "recruitmentcenter/API/Filterapplicants/GetExpertiseName"
    return this.http.get<ApiResponse<IndustryOrExpertiseResponse[]>>(url, { params: queryParams});
  }
  
  getInstitutes(queryParams: any) {
    const url = environment.baseUrl + "recruitmentcenter/API/Filterapplicants/GetInstituteName"
    return this.http.get<ApiResponse<string[]>>(url, { params: queryParams});
  }

  getMajorSubject() {
    const url = environment.baseUrl + "recruitmentcenter/API/FilterApplicants/GetMajorSubject"
    return this.http.get<ApiResponse<MajorSubRes[]>>(url);
  }
  
  getLocationsByQuery(queryParams: any): Observable<any> {
    const url = environment.baseUrl + "recruitmentcenter/API/Filterapplicants/GetLocation"
    return this.http.get(url, { params: queryParams});
  }
}
