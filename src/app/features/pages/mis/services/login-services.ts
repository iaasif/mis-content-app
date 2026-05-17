import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class LoginServices {
  private http = inject(HttpClient);
  readonly isAuthenticated = signal(false);

  login(credentials: any) {
    const payload = new FormData();
    payload.append('USER_NAME', credentials.username);
    payload.append('Password', credentials.password);
    return this.http.post(environment.apiUrl+ 'login/login', payload).pipe(
      tap(() => this.isAuthenticated.set(true))
    );
  }
}
