import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const reinitializePreline = () => {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      setTimeout(() => {
        (window as any).HSStaticMethods.autoInit();
      }, 0);
    } else {
        // SSR: do nothing or log
    }
  }