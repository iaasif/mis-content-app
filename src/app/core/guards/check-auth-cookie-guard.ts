import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CookieService } from '../services/cookie/cookie.service';
import { Router } from '@angular/router';
import { LoginServices } from '../../features/pages/mis/services/login-services';

export const checkAuthCookieGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const loginService = inject(LoginServices);
  const router = inject(Router);

  const isAuthed = cookieService.getCookie('AuthTokenMIS') || loginService.isAuthenticated();
  return isAuthed ? true : router.createUrlTree(['/login']);
};


