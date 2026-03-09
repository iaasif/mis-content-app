import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkRefGuard } from './check-ref-guard';

describe('checkRefGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkRefGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
