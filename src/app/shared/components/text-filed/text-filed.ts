
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { ClipboardModule,Clipboard } from '@angular/cdk/clipboard';
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


  text = input('')
  text2 = signal('aaaaaaaaaas')
  isShowTick=signal(false);

  onClickCopy():void{
    if(this.isBrowser){
      this.isShowTick.set(true)
      this.clipboard.copy(this.text2());
      setTimeout(() => {
        this.isShowTick.set(false)
      }, 4000);
    }
  }
}
