import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ToastrConfig } from './shared/utils/app.const';
import { HTTPInterceptor } from './core/services/interceptors/http.interceptor';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    provideAnimations(),
    provideToastr(ToastrConfig),
    provideHotToastConfig(), // @ngxpert/hot-toast providers
    { provide: HTTP_INTERCEPTORS, useClass: HTTPInterceptor, multi: true }, provideClientHydration(withEventReplay())
  ]
};
