
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { ClipboardModule,Clipboard } from '@angular/cdk/clipboard';
import { Variant } from '../../../features/pages/mis/models/jobs.data';
@Component({
  selector: 'app-text-filed',
  imports: [ClipboardModule],
  templateUrl: './text-filed.html',
  styleUrl: './text-filed.css',
})
export class TextFiled {
  private clipboard= inject(Clipboard)
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  data = input<Variant>({} as Variant)
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
