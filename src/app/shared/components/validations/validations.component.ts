import { ChangeDetectionStrategy, Component, Input, OnChanges, effect, input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-validations',
  standalone: true,
  imports: [],
  templateUrl: './validations.component.html',
  styleUrl: './validations.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ValidationsComponent {
  @Input() formControl = new FormControl();
  @Input() submitted: boolean = false;
  @Input() name = "";

  get errorMessage(): string | null {
    if (this.formControl && this.formControl.errors && (this.formControl.touched || this.submitted)) {
      let message = null;
      switch (true) {
        case this.formControl.hasError('required'):
          message = this.name + ' is Required';
          break;
        case this.formControl.hasError('email'):
          message = 'Invalid email address';
          break;        
        case this.formControl.hasError('minlength'):
          message = `Minimum length is ${this.formControl.errors?.['minlength'].requiredLength}`;
          break;
        case this.formControl.hasError('maxlength'):
          message = `Maximum length is ${this.formControl.errors?.['maxlength'].requiredLength}`;
          break;
        case this.formControl.hasError('min'):
          message = `Please choose an option`;
          break;
        default:
          break;
      }
      return message;
    }
    return null;
  }
}
