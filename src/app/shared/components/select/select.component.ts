import { Console } from 'console';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputType } from '../input/input.component';
import { SelectItem } from '../../models/models';
import { reinitializePreline } from '../../utils/reinitializePreline';
import { NgClass, CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass,CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SelectComponent {
  @Input() placeholder = '';
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() isRequired: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() name = '';
  @Input() control: FormControl = new FormControl();
  @Input() falseOption: boolean = true;
  options = input<SelectItem[]>([]);

}