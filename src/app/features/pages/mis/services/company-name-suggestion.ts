import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanySuggestion } from '../models/jobs.data';

@Injectable({
  providedIn: 'root',
})
export class CompanyNameSuggestion {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://contentapi.bdjobs.com/api/Company/suggestions';

  companyNamesSuggestions(query: string): Observable<CompanySuggestion[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<CompanySuggestion[]>(this.baseUrl, { params });
  }
}

