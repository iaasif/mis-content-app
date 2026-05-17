import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CookieService } from '../services/cookie/cookie.service';
import { Router } from '@angular/router';

export const checkAuthCookieGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const cookieValue = cookieService.getCookie('AuthTokenMIS');
  const router = inject(Router);
  // Return UrlTree — Angular handles the redirect cleanly, no race condition
  return cookieValue ? true : router.createUrlTree(['/login']);
};

function navigateToLogin() {
  const router = inject(Router);
  router.navigate(['/login']);
  return false;
}
