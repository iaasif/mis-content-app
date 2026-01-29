import { Component, input, output, signal, HostListener, ElementRef, effect } from '@angular/core';
import { DropdownOption } from '../../models/models';

@Component({
  selector: 'app-dropdown-component',
  imports: [],
  templateUrl: './dropdown-component.html',
  styleUrl: './dropdown-component.css',
})
export class DropdownComponent {
   // Inputs using new input() API
  options = input.required<DropdownOption[]>();
  placeholder = input<string>('Select an option');
  disabled = input<boolean>(false);
  label = input<string | undefined>(undefined);
  selectedValue = input<string | number | undefined>(undefined);

  // Output using new output() API
  selectionChange = output<DropdownOption>();

  // Signals
  isOpen = signal(false);
  selectedOption = signal<DropdownOption | null>(null);

  constructor(private elementRef: ElementRef) {
    // Effect to handle selectedValue changes
    effect(() => {
      const value = this.selectedValue();
      const opts = this.options();
      
      if (value !== undefined) {
        const option = opts.find(opt => opt.value === value);
        if (option) {
          this.selectedOption.set(option);
        }
      }
    });
  }

  toggleDropdown() {
    if (!this.disabled()) {
      this.isOpen.update(v => !v);
    }
  }

  selectOption(option: DropdownOption) {
    if (!option.disabled) {
      this.selectedOption.set(option);
      this.isOpen.set(false);
      this.selectionChange.emit(option);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
