import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private promises: { [url: string]: Promise<void> | undefined } = {};

  async loadScript(url: string): Promise<void> {
    if (this.promises[url]) {
      return this.promises[url];
    }
    const platformId = inject(PLATFORM_ID);
    if (!isPlatformBrowser(platformId)) {
      // SSR: do nothing or log
      return Promise.resolve();
    }
    this.promises[url] = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
    return this.promises[url];
  }
}
