import { Component, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ScriptLoaderService } from './core/services/script-loader/script-loader.service';
import { IStaticMethods } from 'preline/preline';
import { delay, filter, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { LayoutComponent } from './core/layouts/layout/layout.component';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [LayoutComponent]
})
export class AppComponent {
  title = 'Bdjobs-angular-boilerplate';
  formControlTest = new FormControl(false);

  private scriptLoader = inject(ScriptLoaderService);
  private destroyRef = inject(DestroyRef);
  private subscription = inject(Router)
  .events.pipe(
    takeUntilDestroyed(this.destroyRef),
    filter((event) => event instanceof NavigationEnd),
    delay(100),
    finalize(() => window.HSStaticMethods.autoInit())
  ).subscribe();

  async ngOnInit() {
    typeof window !== 'undefined' &&
    (await this.scriptLoader.loadScript('assets/js/preline.js'));
      window.HSStaticMethods.autoInit();

  }
}
