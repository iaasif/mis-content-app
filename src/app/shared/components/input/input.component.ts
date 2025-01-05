import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { reinitializePreline } from '../../utils/reinitializePreline';
import { NgClass } from '@angular/common';
import { NumericOnlyDirective } from '../../../core/directives/numeric-only.dir';
import { error } from 'console';

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
  @Input() placeholder = '';
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() isRequired: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() minValue:number = 0;
  @Input() maxValue:number = 999999999999;
  @Input() control: FormControl<T> = new FormControl();
  @Input() maxLength: number = 150;
  @Input() classes: string = '';
  @Input() validationText: string = '';
 
  valid: boolean = true;
  
  ngOnInit() {
    this.control.valueChanges.subscribe(value => {
      this.handleValueChange(value);
    });
  }

  private handleValueChange(value: T): void {
    if(this.type == 'text'){
      if(this.control.value){
        this.valid = true;
        this.styleClass = InputTypeStype.normal;
        this.name = InputStype.normal;
      } else{
        this.control.setErrors({ invalid: true });
        this.valid = false;
        this.styleClass = InputTypeStype.error;
        this.name = InputStype.error;
      }
    }
    else {
      if (+this.control.value > this.maxValue || +this.control.value < this.minValue) {
        this.control.setErrors({ invalid: true });
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


  
  name = InputStype.normal;
  styleClass: string = InputTypeStype.normal;

  ngAfterViewInit(): void {
    reinitializePreline();
  }
}
