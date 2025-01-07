import { AfterViewInit, ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { reinitializePreline } from '../../utils/reinitializePreline';
import { NgClass } from '@angular/common';
import { NumericOnlyDirective } from '../../../core/directives/numeric-only.dir';

export type InputType = 'text' | 'password' | 'email' | 'number';

enum InputStype  {
  error = 'hs-validation-name-error',
  success = 'hs-validation-name-success',
  normal = ''
};

enum InputTypeStype {
  normal = 'block w-full rounded-md border-0 py-1.5 pl-5 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
  error = 'py-3 px-4 block w-full border-red-500 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400',
  success = 'py-3 px-4 block w-full border-teal-500 rounded-lg text-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400'
}

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { 
      directive: NumericOnlyDirective, 
      inputs: ['isDecimalAllowed', 'minValue', 'maxValue', 'isNumericOnly']
    }
  ],
})
export class InputComponent<T> implements AfterViewInit {
  readonly placeholder = input<string>('');
  readonly label = input<string>('');
  readonly type = input<InputType>('text');
  readonly isRequired = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly minValue = input<number>(0);
  readonly maxValue = input<number>(999999999999);
  readonly control = input<FormControl<T>>(new FormControl());
  readonly maxLength = input<number>(150);
  readonly classes = input<string>('');
  readonly validationText = input<string>('');
 
  valid: boolean = true;
  name = InputStype.normal;
  styleClass: string = InputTypeStype.normal;
  
  ngOnInit() {
    this.control().valueChanges.subscribe(value => {
      this.handleValueChange(value);
    });
  }

  private handleValueChange(value: T): void {
    if(this.type() == 'text'){
      const control = this.control();
      if(control.value){
        this.valid = true;
        this.styleClass = InputTypeStype.normal;
        this.name = InputStype.normal;
      } else{
        control.setErrors({ invalid: true });
        this.valid = false;
        this.styleClass = InputTypeStype.error;
        this.name = InputStype.error;
      }
    }
    else {
      if (+this.control().value > this.maxValue() || +this.control().value < this.minValue()) {
        this.control().setErrors({ invalid: true });
        this.valid = false;
        this.styleClass = InputTypeStype.error;
        this.name = InputStype.error;
      } else {
        this.valid = true;
        this.styleClass = InputTypeStype.normal;
        this.name = InputStype.normal;
      }
    }
  }

  ngAfterViewInit(): void {
    reinitializePreline();
  }
}
