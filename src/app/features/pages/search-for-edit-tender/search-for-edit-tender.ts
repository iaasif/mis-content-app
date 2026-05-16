import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { DropdownOption } from '../../../shared/models/models';
import { CompanySuggestion } from '../mis/models/jobs.data';
import { CompanyNameSuggestion } from '../mis/services/company-name-suggestion';

export const TenderType: DropdownOption[] = [
  { label: 'All Tenders', value: '1' },
  { label: 'Active Tenders', value: '2' },
  { label: 'Expired Tenders', value: '3' },
];

interface CompanyTender {
  id: number;
  companyId?: number;
  companyName?: string;
  showCompanyNameAs?: string | null;
  companyNameBn?: string | null;
  tenderTitle: string;
  tenderUrl?: string;
  publishedOn: string;
  tenderDeadline: string;
  serialNo: number;
  comments: string;
  totalTenders: number;
  categoryTenderIds?: string;
  companyLogoId?: string | number | null;
  tenderType?: string;
  postedBy?: number;
  sourcePerson?: number;
}

@Component({
  selector: 'app-search-for-edit-tender',
  imports: [NgxsmkDatepickerComponent, DropdownComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './search-for-edit-tender.html',
  styleUrl: './search-for-edit-tender.css',
})
export class SearchForEditTender {
  private readonly companyNameService = inject(CompanyNameSuggestion);
  private readonly router = inject(Router);
  private readonly hotToaster = inject(HotToastService);

  isLoadingCompanies = signal(false);
  companyId = signal(0);
  results = signal<CompanyTender[]>([]);
  isLoading = signal(false);
  tenderType = signal(TenderType);

  companies = computed(() => this.companySuggestState().suggestions);

  form = new FormGroup({
    companyName: new FormControl(''),
    companyId: new FormControl(0),
    tenderType: new FormControl('', { validators: [Validators.required] }),
    fromDate: new FormControl<Date | null>(null),
    toDate: new FormControl<Date | null>(null),
  });

  private companySuggestState = toSignal(
    this.form.controls.companyName.valueChanges.pipe(
      map((value) => value?.trim() ?? ''),
      debounceTime(300),
      distinctUntilChanged(),
      tap((query) => {
        if (query.length >= 2) this.isLoadingCompanies.set(true);
      }),
      switchMap((query) =>
        query.length >= 2
          ? this.companyNameService.companyNamesSuggestions(query).pipe(
              map((suggestions) => ({ query, suggestions })),
              catchError(() => of({ query, suggestions: [] as CompanySuggestion[] })),
              finalize(() => this.isLoadingCompanies.set(false))
            )
          : of({ query, suggestions: [] as CompanySuggestion[] }).pipe(
              finalize(() => this.isLoadingCompanies.set(false))
            )
      )
    ),
    { initialValue: { query: '', suggestions: [] as CompanySuggestion[] } }
  );

  shouldShowList = computed(() => {
    const { query } = this.companySuggestState();
    return (this.companyId() === 0 && query.length >= 1) || this.isLoadingCompanies();
  });

  totalTenders = computed(() =>
    this.results().reduce((sum, item) => sum + (item.totalTenders ?? 0), 0)
  );

  selectCompany(company: CompanySuggestion): void {
    this.form.controls.companyName.setValue(company.companyName, { emitEvent: false });
    this.form.controls.companyId.setValue(company.comId, { emitEvent: false });
    this.companyId.set(company.comId);
  }

  onCompanyInput(): void {
    if (this.companyId() !== 0) {
      this.companyId.set(0);
      this.form.controls.companyId.setValue(0, { emitEvent: false });
    }
  }

  setFromDate(value: DatepickerValue): void {
    const date = value instanceof Date ? value : this.datepickerRangeStart(value);
    this.form.controls.fromDate.setValue(date);
  }

  setToDate(value: DatepickerValue): void {
    const date = value instanceof Date ? value : this.datepickerRangeStart(value);
    this.form.controls.toDate.setValue(date);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hotToaster.error('Please fill all required fields');
      return;
    }

    if ((this.form.value.companyId ?? 0) === 0) {
      this.hotToaster.error('Please Select a Company');
      return;
    }

    this.isLoading.set(true);

    const payload = {
      companyId: this.form.value.companyId ?? 0,
      tenderType: this.form.value.tenderType ?? null,
      fromDate: this.form.value.fromDate ?? null,
      toDate: this.form.value.toDate ?? null,
    };

    console.log('tender search payload', payload);
    this.results.set([]);
    this.isLoading.set(false);
  }

  onEdit(item: CompanyTender): void {
    this.router.navigate(['/edit-tender'], {
      queryParams: {
        tenderId: item.id,
        companyId: item.companyId ?? this.form.value.companyId,
        companyName: item.companyName ?? this.form.value.companyName,
        showCompanyNameAs: item.showCompanyNameAs ?? item.companyName ?? this.form.value.companyName,
        companyNameBn: item.companyNameBn ?? null,
        tenderTitle: item.tenderTitle,
        tenderUrl: item.tenderUrl ?? '',
        comments: item.comments,
        categoryTenderIds: item.categoryTenderIds ?? '',
        companyLogoId: item.companyLogoId ?? null,
        numberOfTenders: item.totalTenders,
        tenderType: item.tenderType ?? null,
        displayPosition: item.serialNo,
        publishedDate: item.publishedOn,
        tenderDeadline: item.tenderDeadline,
        postedBy: item.postedBy ?? null,
        sourcePerson: item.sourcePerson ?? null,
      },
    });
  }

  onDelete(item: CompanyTender): void {
    console.log('Delete tender:', item);
  }

  private datepickerRangeStart(value: DatepickerValue): Date | null {
    if (!value || typeof value !== 'object' || !('start' in value)) return null;
    const start = (value as { start?: unknown }).start;
    return start instanceof Date ? start : null;
  }
}
