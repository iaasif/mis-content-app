import { Component, computed, inject, signal } from '@angular/core';
import { DropdownOption } from '../../../shared/models/models';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { toSignal } from '@angular/core/rxjs-interop';
import { MisApi } from '../mis/services/mis-api';
import { CompanyNameSuggestion } from '../mis/services/company-name-suggestion';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, switchMap, tap } from 'rxjs';
import { CompanySuggestion } from '../mis/models/jobs.data';
import { CompanyHotJob, CompanyHotJobsPayload } from '../mis/utils/mis.data';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

export const JobType: DropdownOption[] = [
  { label: "All Jobs",     value: "1" },
  { label: "Active Jobs",  value: "2" },
  { label: "Expired Jobs", value: "3" },
];

@Component({
  selector: 'app-search-for-edit',
  imports: [NgxsmkDatepickerComponent, DropdownComponent, ReactiveFormsModule,DatePipe],
  templateUrl: './search-for-edit.html',
  styleUrl: './search-for-edit.css',
})
export class SearchForEdit {
  private companyNameService = inject(CompanyNameSuggestion);
  private misApiService = inject(MisApi);
  private router = inject(Router)
  private hotToaster = inject(HotToastService)

  companyId = signal(0);
  results   = signal<CompanyHotJob[]>([]);
  isLoading = signal(false);
  jobType   = signal(JobType);

  companies = computed(() => this.companySuggestState().suggestions);

  form = new FormGroup({
    companyName: new FormControl(''),
    companyId:   new FormControl(0),
    jobType:     new FormControl(''),
    fromDate:    new FormControl<Date | null>(null),
    toDate:      new FormControl<Date | null>(null),
  });

  private companySuggestState = toSignal(
    this.form.controls.companyName.valueChanges.pipe(
      map((value) => value?.trim() ?? ''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) =>
        query.length >= 2
          ? this.companyNameService.companyNamesSuggestions(query).pipe(
              map((suggestions) => ({ query, suggestions })),
              catchError(() => of({ query, suggestions: [] as CompanySuggestion[] }))
            )
          : of({ query, suggestions: [] as CompanySuggestion[] })
      ),
    ),
    { initialValue: { query: '', suggestions: [] as CompanySuggestion[] } }
  );

  shouldShowList = computed(() => {
    const { query, suggestions } = this.companySuggestState();
    return this.companyId() === 0 && query.length >= 1;
  });

  totalPositions = computed(() =>
    this.results().reduce((sum, item) => sum + (item.totalJobs ?? 0), 0)
  );

  selectCompany(company: CompanySuggestion): void {
    this.form.controls.companyName.setValue(company.companyName, { emitEvent: false });
    this.form.controls.companyId.setValue(company.comId,         { emitEvent: false });
    this.companyId.set(company.comId);
  }

  onCompanyInput(): void {
    if (this.companyId() !== 0) {
      this.companyId.set(0);
      this.form.controls.companyId.setValue(0, { emitEvent: false });
    }
  }

  setFromDate(value: DatepickerValue): void {
    const date = value instanceof Date ? value : (value as any)?.start ?? null;
    this.form.controls.fromDate.setValue(date);
  }

  setToDate(value: DatepickerValue): void {
    const date = value instanceof Date ? value : (value as any)?.start ?? null;
    this.form.controls.toDate.setValue(date);
  }

  submit(): void {
    this.isLoading.set(true);
    

    const payload: CompanyHotJobsPayload = {
      companyId: this.form.value.companyId ?? 0,
      jobType:   this.form.value.jobType   ?? null,
      fromDate:  this.form.value.fromDate  ?? null,
      toDate:    this.form.value.toDate    ?? null,
    };

    this.misApiService.getCompanyHotJobs(payload)
    .pipe(finalize(() => {
      this.isLoading.set(false)
    }))
    .subscribe({
      next: (response) => {
        this.results.set(response.success ? response.data : []);   
        if(this.results().length<1){
          this.hotToaster.error('Please Select a Company');
        } 
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.hotToaster.error('Search failed');
      },
    });
  }

  onEdit(item: CompanyHotJob): void {
    console.log('Edit:', item);
    this.router.navigate(['/edit'],{
      queryParams:{comID:item.id}
    })
  }

  onDelete(item: CompanyHotJob): void {
    console.log('Delete:', item);
  }
}