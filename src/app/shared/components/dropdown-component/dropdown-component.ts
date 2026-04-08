import {
  ChangeDetectionStrategy, Component, DestroyRef,
  ElementRef, computed, effect, inject, input, output, signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DropdownOption } from '../../models/models';

@Component({
  selector: 'app-dropdown-component',
  imports: [ReactiveFormsModule],
  templateUrl: './dropdown-component.html',
  styleUrl: './dropdown-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class DropdownComponent<T extends string | number> {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

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

  private readonly controlStatus = signal<string>('');

  constructor() {
    // ✅ ctrl.events catches ALL changes: value, status, touched, dirty, pristine
    effect(() => {
      const ctrl = this.control();
      this.controlStatus.set(this.snapshot(ctrl)); // seed
      
      ctrl.events
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.controlStatus.set(this.snapshot(ctrl)));
    });

    effect(() => {
      const value = this.control().value;
      const opts = this.options();
      if (value === null || value === undefined || value === '') {
        this.selectedOption.set(null);
        return;
      }
      this.selectedOption.set(opts.find((opt) => opt.value === value) ?? null);
    });

    effect(() => {
      const disabled = this.isDisabled();
      const control = this.control();
      if (disabled && !control.disabled) { control.disable({ emitEvent: false }); this.isOpen.set(false); }
      if (!disabled && control.disabled) { control.enable({ emitEvent: false }); }
    });
  }

  // Snapshot all the state we care about into one string
  private snapshot(ctrl: FormControl<T | null>): string {
    return `${ctrl.status}|${ctrl.touched}|${ctrl.dirty}`;
  }

  readonly showError = computed(() => {
    this.controlStatus(); // establishes reactivity
    const ctrl = this.control();
    return ctrl.invalid && (ctrl.touched || ctrl.dirty);
  });

  readonly errorMessage = computed(() => {
    this.controlStatus();
    const errors = this.control().errors;
    if (!errors || !this.showError()) return '';
    if (errors['required']) return this.validationText() || 'This field is required';
    return this.validationText() || 'Invalid value';
  });

  toggleDropdown(): void {
    if (this.isDisabled() || this.control().disabled) return;
    this.isOpen.update((v) => !v);
    this.control().markAsTouched();
  }

  selectOption(option: DropdownOption): void {
    if (option.disabled || this.isDisabled() || this.control().disabled) return;
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