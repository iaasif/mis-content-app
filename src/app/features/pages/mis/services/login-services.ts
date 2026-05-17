import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginServices {
  private readonly http = inject(HttpClient);
  private readonly logInUrl = environment.apiUrl + 'login/login';
  
  login(data: any): Observable<any> {
    const payload = new FormData();
    payload.append('USER_NAME', data.username);
    payload.append('Password', data.password);

    return this.http.post<any>(this.logInUrl, payload);
  }
}
