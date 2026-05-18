import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CookieService } from '../services/cookie/cookie.service';
import { Router } from '@angular/router';
import { LoginServices } from '../../features/pages/mis/services/login-services';
import { Cookies } from '../../shared/enums/app.enums';

export const checkAuthCookieGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const loginService = inject(LoginServices);
  const router = inject(Router);

  const isAuthed = cookieService.getCookie(Cookies.MISAUTH) || loginService.isAuthenticated();
  return isAuthed ? true : router.createUrlTree(['/login']);
};


