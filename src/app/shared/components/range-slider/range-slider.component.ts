import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';
import { FormControl, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [NgxSliderModule, ReactiveFormsModule],
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeSliderComponent {
  @Input({required: true}) control: UntypedFormControl = new UntypedFormControl();
  @Input() label!: string;
  @Input({required: true}) options: Options = {
    floor: 0,
    ceil: 100
  };

  isBrowser: boolean = true;
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
}
