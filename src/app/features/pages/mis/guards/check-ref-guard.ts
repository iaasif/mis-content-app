import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

const ALLOWED_ORIGINS = ['mis.bdjobs.com','localhost', 'localhost:4200', 'localhost:4201'];

export const checkRefGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const hotToast = inject(HotToastService);

  // 1. Check document.referrer (works on hard/external navigation)
  const docReferrer = document.referrer;

  // 2. Check Angular router navigation state (works on SPA navigation)
  const navState = router.getCurrentNavigation()?.extras?.state;
  const routerReferrer: string = navState?.['referrer'] ?? '';

  const isAllowed = ALLOWED_ORIGINS.some(origin =>
    docReferrer.includes(origin) || routerReferrer.includes(origin)
  );

  if (isAllowed) {
    return true;
  }

  hotToast.error('You are not authorized to access this page');
  // router.navigate(['/']); // optional redirect
  return false;
};
