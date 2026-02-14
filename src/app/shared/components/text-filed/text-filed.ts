
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { ClipboardModule,Clipboard } from '@angular/cdk/clipboard';
import { Variant } from '../../../features/pages/mis/models/jobs.data';

/** Any object with publicUrl so both image variants and HTML upload response can use the copy UI. */
export type TextFiledData = Variant | { publicUrl: string };

@Component({
  selector: 'app-text-filed',
  imports: [ClipboardModule],
  templateUrl: './text-filed.html',
  styleUrl: './text-filed.css',
})
export class TextFiled {
  private clipboard = inject(Clipboard);
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  data = input<TextFiledData>({} as TextFiledData);
  isShowTick=signal(false);

  onClickCopy():void{
    if(this.isBrowser){
      this.isShowTick.set(true)
      this.clipboard.copy(this.data().publicUrl);
      setTimeout(() => {
        this.isShowTick.set(false)
      }, 4000);
    }
  }
}
