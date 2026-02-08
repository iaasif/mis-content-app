import { isPlatformBrowser } from '@angular/common';
import { Component, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

@Component({
  selector: 'app-text-filed',
  imports: [],
  templateUrl: './text-filed.html',
  styleUrl: './text-filed.css',
})
export class TextFiled {
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);


  text = input('')
  text2 = 'https://storage.googleapis.com/bdjobs/CompanyLogos/Hotjobs/877866_300x300_pexels-kim-438153-1159976.jpg'
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
