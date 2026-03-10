import { inject, signal } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

export const checkRefGuard: CanActivateFn = (route, state) => {
  const referrer = signal(document.referrer);
  const hotToast = inject(HotToastService);

  const filteredRef = signal(referrer().includes('mis.bdjobs.com') || referrer().includes('localhost'))

  if (filteredRef()) {
    return true;
  }
  hotToast.error('You are not Authorized to access this page');
  return false;
};
