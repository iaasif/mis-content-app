import { Component, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectRadioData } from '../../models/models';

@Component({
  selector: 'app-checkbox-new',
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox-new.html',
  styleUrl: './checkbox-new.css',
})
export class CheckboxNew {
  readonly isRequired = input(false);
  readonly isDisabled = input(false);
  control = model(new FormControl<(string | boolean)[]>([])); // ✅ allow boolean too
  checkboxItems = input<SelectRadioData[]>([]);
  isHtmlLabel = input(false);

  isChecked(value: string | boolean): boolean {
    return this.control()?.value?.includes(value) ?? false;
  }

  onCheckboxChange(value: string | boolean, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const currentValues = this.control()?.value || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    this.control()?.setValue(newValues);
  }

  generateId(item: SelectRadioData): string {
    return `${item.name}-${item.id}`;
  }
}
