import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RadioComponent } from "../../../shared/components/radio/radio.component";
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { HotJobType, HotJobCategory, priorities } from '../mis/utils/mis.data';
import { CheckboxNew } from "../../../shared/components/checkbox-new/checkbox-new";
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { CompanySuggestion, HotJobForm, HotJobFormControls } from '../mis/models/jobs.data';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { CompanyNameSuggestion } from '../mis/services/company-name-suggestion';
import { StoreDataService } from '../mis/services/store-data-service';

@Component({
  selector: 'app-new-job',
  imports: [RouterLink, ReactiveFormsModule, DropdownComponent, NgxsmkDatepickerComponent, InputComponent, InputComponent, RadioComponent, DropdownComponent, CheckboxNew, FormsModule, CommonModule],
  templateUrl: './new-job.html',
  styleUrl: './new-job.css'
})
export class NewJob implements OnInit {
  private readonly router = inject(Router);
  private readonly companyApi = inject(CompanyNameSuggestion);
  private readonly destroyRef = inject(DestroyRef);
  protected storeData = inject(StoreDataService);

  companyName = this.storeData.SELECTED_COMPANY ?? null;
  currentRoute = signal<string>(this.router.url);
  query = signal('');
  isFocused = signal(false);
  suggestions = signal<CompanySuggestion[]>([]);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  hotJobCategory = signal(HotJobCategory);
  hotJobsType = signal(HotJobType);
  position = signal(priorities);

  PublishedDate = signal<DatepickerValue>(null);
  Deadline = signal<DatepickerValue>(null);

  FromDate = signal<DatepickerValue>(null);
  ToDate = signal<DatepickerValue>(null);

  // for Display Logo radio
  displayLogoOptions =signal([
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ]) ;

  ngOnInit(): void {
    const sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute.set(event.urlAfterRedirects);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
  
  newHotJobForm = new FormGroup<HotJobFormControls>({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    showCompanyNameAs: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    companyNameBn: new FormControl('', { nonNullable: true }),
    jobTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    hotJobsUrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    comments: new FormControl<string | null>(null),

    categoryJobIds: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    displayLogo: new FormControl(false, { nonNullable: true }),
    companyLogoId: new FormControl<null | string | number>(null),

    numberOfJobs: new FormControl(0, { nonNullable: true, validators: [Validators.min(0),Validators.required] }),

    hotJobsType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    // you are using this as checkbox selected values (fine, but type should match your component)
    postedOptions: new FormControl<(string | boolean)[]>([], { nonNullable: true }),

    displayPosition: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),

    publishedDate: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),
    jobDeadline: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),

    premiumStartDate: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),
    premiumEndDate: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),

    postedBy: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),
    sourcePerson: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),
  });


  onPublishedDateChange(val: DatepickerValue) {
    console.log('From date changed:', val);
    this.PublishedDate.set(val);
    const isoDate = this.datepickerToIso(val);
    console.log('Setting premiumStartDate to:', isoDate);
    this.newHotJobForm.controls.publishedDate.setValue(isoDate);
  }
  
  onJobDeadlineChange(val: DatepickerValue) {
    console.log('To date changed:', val);
    this.Deadline.set(val);
    const isoDate = this.datepickerToIso(val);
    console.log('Setting premiumEndDate to:', isoDate);
    this.newHotJobForm.controls.jobDeadline.setValue(isoDate);
  }

  onFromDateChange(val: DatepickerValue) {
    console.log('From date changed:', val);
    this.FromDate.set(val);
    const isoDate = this.datepickerToIso(val);
    console.log('Setting premiumStartDate to:', isoDate);
    this.newHotJobForm.controls.premiumStartDate.setValue(isoDate);
  }

  onToDateChange(val: DatepickerValue) {
    console.log('To date changed:', val);
    this.ToDate.set(val);
    const isoDate = this.datepickerToIso(val);
    console.log('Setting premiumEndDate to:', isoDate);
    this.newHotJobForm.controls.premiumEndDate.setValue(isoDate);
  }

  private datepickerToIso(val: DatepickerValue): string {
    // ngxsmk DatepickerValue is often Date | null (or sometimes {start,end})
    if (!val) return '';
    if (val instanceof Date) return val.toISOString();

    // If your picker returns range objects sometimes:
    // @ts-ignore - depends on your lib's actual type
    if (val?.start instanceof Date) return val.start.toISOString();

    return '';
  }

  submit(): void {
    console.log('=== FORM SUBMISSION TRIGGERED ===');
    console.log('Form valid:', this.newHotJobForm.valid);
    console.log('Form status:', this.newHotJobForm.status);

    // Log all form values
    console.log('Form value:', this.newHotJobForm.value);
    console.log('Form raw value:', this.newHotJobForm.getRawValue());

    // Log validation errors if any
    if (this.newHotJobForm.invalid) {
      console.log('=== FORM VALIDATION ERRORS ===');
      Object.keys(this.newHotJobForm.controls).forEach(key => {
        const control = this.newHotJobForm.get(key);
        if (control && control.invalid) {
          console.log(`Field "${key}" errors:`, control.errors);
        }
      });
      console.log('Marking all fields as touched for validation display');
      this.newHotJobForm.markAllAsTouched();
      return;
    }

    const payload: HotJobForm = this.newHotJobForm.getRawValue();
    console.log('=== FINAL PAYLOAD ===');
    console.log('Hot job payload:', payload);
    console.log('=== END SUBMISSION ===');
  }

  onQueryChange(value: string): void {
    this.query.set(value);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    if (!value.trim()) {
      this.suggestions.set([]);
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.companyApi.companyNamesSuggestions(value.trim()).pipe(
        tap((res) => {
          console.log('API call for suggestions with query:', res);
        })
      ).subscribe({
        next: list => this.suggestions.set(list.slice(0, 8)),
        error: () => this.suggestions.set([]),
      });
    }, 150);
  }

  selectCompany(data: CompanySuggestion): void {
    localStorage.setItem('SELECTED_COMPANY', JSON.stringify(data));
    this.storeData.SELECTED_COMPANY.set(data);
    this.query.set(data.companyName);
    this.isFocused.set(false);
    this.suggestions.set([]);
    console.log("data", data)
    console.log("selected company", this.storeData.SELECTED_COMPANY())
    console.log("this.suggestions", this.suggestions())

  }

  clearCompany(): void {
    localStorage.removeItem('SELECTED_COMPANY');
    this.storeData.SELECTED_COMPANY.set(null);
    this.query.set('');
    this.suggestions.set([]);
  }

  onFocus(): void {
    this.isFocused.set(true);
    const q = this.query().trim();
    if (q) {
      this.companyApi.companyNamesSuggestions(q).subscribe({
        next: list => this.suggestions.set(list.slice(0, 8)),
        error: () => this.suggestions.set([]),
      });
    }
  }

  onBlur(): void {
    setTimeout(() => this.isFocused.set(false), 120);
  }
}
