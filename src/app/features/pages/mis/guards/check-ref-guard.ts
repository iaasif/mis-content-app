import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

const ALLOWED_ORIGINS = ['mis.bdjobs.com', 'localhost', 'localhost:4200', 'localhost:4201'];

export const checkRefGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const hotToast = inject(HotToastService);

  // 1. document.referrer — often EMPTY on same-origin or direct navigation
  const docReferrer = document.referrer;

  // 2. Router navigation state — must be read DURING active navigation
  const navigation = router.currentNavigation();
  const routerReferrer: string = navigation?.extras?.state?.['referrer'] ?? '';

  // 3. Fallback: check window.location.hostname for localhost dev access
  const currentHost = window.location.hostname;

  const isAllowed =
    ALLOWED_ORIGINS.some(
      origin => docReferrer.includes(origin) || routerReferrer.includes(origin)
    ) || ALLOWED_ORIGINS.includes(currentHost); // ← allows direct localhost access

  if (isAllowed) {
    return true;
  }

  hotToast.error('You are not authorized to access this page');
  return false;
};