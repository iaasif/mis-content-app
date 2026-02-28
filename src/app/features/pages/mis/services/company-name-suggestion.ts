import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyNameSuggestion {
  router = inject(Router);
  http = inject(HttpClient);
  url = 'https://api.bdjobs.com/JobSeeker/api/JobSeeker/GetCompanyNames';

  getCompanyName(query: string): Observable<any> {
    return this.http.get(this.url, { params: { query } });
  }
}
