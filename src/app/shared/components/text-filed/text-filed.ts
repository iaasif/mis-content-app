import { isPlatformBrowser } from '@angular/common';
import { Component, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
// import { ClipboardModule } from 'ngx-clipboard';
import { ClipboardModule } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-text-filed',
  imports: [ClipboardModule],
  templateUrl: './text-filed.html',
  styleUrl: './text-filed.css',
})
export class TextFiled {
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);


  text = input('')
  text2 = signal('asas')
  isShowTick=signal(false);

  onClickCopy():void{
    console.log('onClickCopy function called!');
    console.log('isBrowser:', this.isBrowser);
    if(this.isBrowser){
      this.isShowTick.set(true)
      setTimeout(() => {
        this.isShowTick.set(false)
      }, 4000);
    }
  }
}
