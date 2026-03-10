import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

export const checkRefGuard: CanActivateFn = (route, state) => {
  const referrer = document.referrer;
  const hotToast = inject(HotToastService);

  const filteredRef = referrer.includes('mis.bdjobs.com') || referrer.includes('localhost:4200');

  if (filteredRef) {
    return true;
  }
  hotToast.error('You are not Authorized to access this page');
  return false;
};
