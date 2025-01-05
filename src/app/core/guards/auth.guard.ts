import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild  {

  constructor(private authService: AuthService) {}

  canActivate(): boolean {
    return this.checkAuth();
  }

  canActivateChild(): boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    if (!environment.production) {
      return true;
    }
    if (this.authService.isAuthenticatedUser()) {
        return true;
    } else {
        if (environment.production) {
            this.authService.redirectToRecruiterApp();
        }
        return false;
    }
  }

}