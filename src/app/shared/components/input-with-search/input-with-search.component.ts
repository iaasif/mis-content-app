import { NgClass } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-with-search',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './input-with-search.component.html',
  styleUrl: './input-with-search.component.scss',
})
export class InputWithSearchComponent implements OnInit{
  @Input() label = '';
  @Input() placeholder = '';
  @Input() isRequired: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() name = '';
  @Input() control: FormControl = new FormControl();
  @Input() isIcon = false;
  @Input() searchBtnLabel = '';
  @Input() maxlength: number = 95; // Maximum length for the input value, default set to 95.
  @ViewChild('inpt') inpt!: ElementRef<HTMLInputElement>;
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.control.valueChanges
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      if (!value) {
        this.inpt.nativeElement.value = value;
      }
    });
  }

  onSearchBtnClick(value: string) {
    if (this.control) {
      this.control.setValue(value);
    }
  }

}
