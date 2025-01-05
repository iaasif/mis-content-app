import { Directive, HostListener, Input, input } from '@angular/core';

@Directive({
  selector: 'input[appNumericOnly]',
  standalone: true
})
export class NumericOnlyDirective {
  isNumericOnly = input(true);
  isDecimalAllowed = input(true);
  minValue = input<number>(0);
  maxValue = input<number>(999999999999);
  private allowedKeys: string[] = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];



  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.allowedKeys.indexOf(event.key) !== -1 || !this.isNumericOnly()) {
      return;
    }
    const pattern = this.isDecimalAllowed() ? /^[0-9\.]$/ : /^[0-9]$/
    if (!event.key.match(pattern)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    const pattern = this.isDecimalAllowed() ? /^[0-9\.]$/ : /^[0-9]$/
    if (!pastedText.match(pattern)) {
      event.preventDefault();
    }
  }

  checkMinMaxValue(event: Event) {
    //console.log(+(event.target as HTMLInputElement).value)
      if (this.minValue() && ((this.maxValue() > +(event.target as HTMLInputElement).value &&  +(event.target as HTMLInputElement).value > this.minValue()))) {
        return;
      }
  } 
}
