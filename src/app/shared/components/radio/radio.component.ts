import { ChangeDetectionStrategy, Component, Input, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RadioOption, SelectRadioData } from '../../models/models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RadioComponent {

  groupName = input<string>('');
  readonly isRequired = input<boolean>(false);
  // readonly isDisabled = input<boolean>(false);
  control = model(new FormControl());
  radioItems = input<SelectRadioData[] | RadioOption[] >([]);
  isHtmlLabel = input<boolean>(false);
  isHorizontalOption = input<boolean>(true);

  // ✅ Replace your old generateId with this
  generateId(item: SelectRadioData | RadioOption): string {
    if ('id' in item && 'name' in item) {
      return `${item.name}-${item.id}`;
    }
    return `radio-${item.value}`;
  }
}
