import { HttpInterceptorFn } from '@angular/common/http';
import { CookieService } from '../../core/services/cookie/cookie.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.getCookie('auth_token');
  
  if (req.url.includes('xyz')) {
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }
 
  return next(req);
};
