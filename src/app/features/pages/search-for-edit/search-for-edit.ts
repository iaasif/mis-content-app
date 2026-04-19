import { Component, computed, inject, signal } from '@angular/core';
import { DropdownOption } from '../../../shared/models/models';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { toSignal } from '@angular/core/rxjs-interop';
import { MisApi } from '../mis/services/mis-api';
import { CompanyNameSuggestion } from '../mis/services/company-name-suggestion';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { CompanySuggestion } from '../mis/models/jobs.data';

export const JobType: DropdownOption[] = [
  { label: "All Jobs",     value: "1" },
  { label: "Active Jobs",  value: "2" },
  { label: "Expired Jobs", value: "3" },
];

@Component({
  selector: 'app-search-for-edit',
  imports: [NgxsmkDatepickerComponent, DropdownComponent, ReactiveFormsModule],
  templateUrl: './search-for-edit.html',
  styleUrl: './search-for-edit.css',
})
export class SearchForEdit {
  private companyNameService = inject(CompanyNameSuggestion);
  private misApiService = inject(MisApi);

  jobType = signal(JobType);

  // ── Form Group ────────────────────────────────────────────────
  form = new FormGroup({
    companyName: new FormControl(''),
    companyId:   new FormControl(0),
    jobType:     new FormControl(''),       // string to match DropdownOption.value
    fromDate:    new FormControl<DatepickerValue>(null),
    toDate:      new FormControl<DatepickerValue>(null),
  });

  // Convenience getters
  get companyNameControl() { return this.form.controls.companyName; }
  get jobTypeControl()     { return this.form.controls.jobType; }

  // ── Company suggestion state ──────────────────────────────────
  companyId = signal(0); // separate signal so computed() can track it reactively

  private companySuggestState = toSignal(
    this.form.controls.companyName.valueChanges.pipe(
      map((value) => value?.trim() ?? ''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) =>
        query.length >= 2
          ? this.companyNameService.companyNamesSuggestions(query).pipe(
              map((suggestions) => ({ query, suggestions })),
              catchError(() =>
                of({ query, suggestions: [] as CompanySuggestion[] })
              )
            )
          : of({ query, suggestions: [] as CompanySuggestion[] })
      )
    ),
    {
      initialValue: {
        query: '',
        suggestions: [] as CompanySuggestion[],
      },
    }
  );

  companies = computed(() => this.companySuggestState().suggestions);

  /** Show dropdown when nothing selected yet, query is long enough, and we have rows. */
  shouldShowList = computed(() => {
    const { query, suggestions } = this.companySuggestState();
    return (
      this.companyId() === 0 &&
      query.length >= 2 &&
      suggestions.length > 0
    );
  });

  // ── Handlers ─────────────────────────────────────────────────
  selectCompany(company: CompanySuggestion): void {
    this.form.controls.companyName.setValue(company.companyName, { emitEvent: false });
    this.form.controls.companyId.setValue(company.comId,         { emitEvent: false });
    this.companyId.set(company.comId); // triggers shouldShowList to hide dropdown
  }

  // Typing again resets the selected company so dropdown can reappear
  onCompanyInput(): void {
    if (this.companyId() !== 0) {
      this.companyId.set(0);
      this.form.controls.companyId.setValue(0, { emitEvent: false });
    }
  }

  setFromDate(value: DatepickerValue): void {
    this.form.controls.fromDate.setValue(value);
  }

  setToDate(value: DatepickerValue): void {
    this.form.controls.toDate.setValue(value);
  }

  // Add to signals
  results = signal<any[]>([]);
  isLoading = signal(false);

  totalPositions = computed(() =>
    this.results().reduce((sum, item) => sum + (item.displaypostion ?? 0), 0)
  );

  // will work later 
  submit(): void {
    this.isLoading.set(true);

    const payload = {
      companyId: this.form.value.companyId ?? 0,
      jobType: this.form.value.jobType,
      fromDate: this.form.value.fromDate as DatepickerValue | null | undefined,
      toDate: this.form.value.toDate as DatepickerValue | null | undefined,
    };

    this.misApiService.getCompanyHotJobs(payload).subscribe({
      next: (result) => {
        console.log("uu",result)
        this.results.set(Array.isArray(result) ? result : []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.isLoading.set(false);
      },
    });
  }

  onEdit(item: any): void {
    console.log('Edit:', item);
  }

  onDelete(item: any): void {
    console.log('Delete:', item);
  }
}