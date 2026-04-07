import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DropdownOption } from '../../models/models';

@Component({
  selector: 'app-dropdown-component',
  imports: [ReactiveFormsModule],
  templateUrl: './dropdown-component.html',
  styleUrl: './dropdown-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class DropdownComponent<T extends string | number> {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly options = input.required<DropdownOption[]>();
  readonly placeholder = input<string>('Select an option');
  readonly label = input<string>('');
  readonly isRequired = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly validationText = input<string>('');
  readonly control = input.required<FormControl<T | null>>();

  readonly selectionChange = output<DropdownOption>();

  readonly isOpen = signal(false);
  readonly selectedOption = signal<DropdownOption | null>(null);

  constructor() {
    effect(() => {
      const value = this.control().value;
      const opts = this.options();

      if (value === null || value === undefined || value === '') {
        this.selectedOption.set(null);
        return;
      }

      const match = opts.find((opt) => opt.value === value) ?? null;
      this.selectedOption.set(match);
    });

    effect(() => {
      const disabled = this.isDisabled();
      const control = this.control();

      if (disabled && !control.disabled) {
        control.disable({ emitEvent: false });
        this.isOpen.set(false);
      }

      if (!disabled && control.disabled) {
        control.enable({ emitEvent: false });
      }
    });
  }

  readonly showError = computed(() => {
    const currentControl = this.control();
    return currentControl.invalid && (currentControl.touched || currentControl.dirty);
  });

  readonly errorMessage = computed(() => {
    const errors = this.control().errors;

    if (!errors || !this.showError()) {
      return '';
    }

    if (errors['required']) {
      return this.validationText() || 'This field is required';
    }

    if (errors['invalid']) {
      return this.validationText() || 'Invalid value';
    }

    return this.validationText() || 'Invalid value';
  });

  toggleDropdown(): void {
    if (this.isDisabled() || this.control().disabled) {
      return;
    }

    this.isOpen.update((value) => !value);
    this.control().markAsTouched();
  }

  selectOption(option: DropdownOption): void {
    if (option.disabled || this.isDisabled() || this.control().disabled) {
      return;
    }

    this.selectedOption.set(option);
    this.control().setValue(option.value as T);
    this.control().markAsDirty();
    this.control().markAsTouched();
    this.control().updateValueAndValidity();

    this.isOpen.set(false);
    this.selectionChange.emit(option);
  }

  onDocumentClick(event: Event): void {
    const target = event.target as Node | null;

    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
      this.control().markAsTouched();
    }
  }
}