import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkAuthCookieGuard } from './check-auth-cookie-guard';

describe('checkAuthCookieGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkAuthCookieGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
