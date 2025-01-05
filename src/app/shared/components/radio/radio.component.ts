import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectRadioData } from '../../models/models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RadioComponent {

  @Input() isRequired: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() control = new FormControl();
  radioItems = input<SelectRadioData[]>([]);
  isHtmlLabel = input<boolean>(false);
  isHorizontalOption = input<boolean>(true);

  // generate unique IDs for label and id matching
  generateId(item: SelectRadioData): string {
    return `${item.name}-${item.id}`;
  }
}
