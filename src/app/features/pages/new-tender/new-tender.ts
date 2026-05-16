import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { catchError, debounceTime, distinctUntilChanged, map, of, Subject, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { RadioComponent } from '../../../shared/components/radio/radio.component';
import { CheckboxNew } from '../../../shared/components/checkbox-new/checkbox-new';
import { DropdownOption, SelectRadioData } from '../../../shared/models/models';
import { CompanySuggestion } from '../mis/models/jobs.data';
import { priorities } from '../mis/utils/mis.data';
import { CompanyNameSuggestion } from '../mis/services/company-name-suggestion';
import { StoreDataService } from '../mis/services/store-data-service';
import { MisApi } from '../mis/services/mis-api';

const TenderType: SelectRadioData[] = [
  { id: '1', label: 'Government', name: 'Government', value: 'Government' },
  { id: '2', label: 'Private', name: 'Private', value: 'Private' },
];

const TenderCategory: SelectRadioData[] = [
  { id: '1', label: 'Tender Notice', name: 'TenderNotice', value: 'TenderNotice' },
  { id: '2', label: 'Corrigendum', name: 'Corrigendum', value: 'Corrigendum' },
  { id: '3', label: 'EOI', name: 'EOI', value: 'EOI' },
];

type TenderFormControls = {
  companyId: FormControl<number>;
  companyName: FormControl<string>;
  showCompanyNameAs: FormControl<string | null>;
  companyNameBn: FormControl<string | null>;
  tenderTitle: FormControl<string>;
  tenderUrl: FormControl<string>;
  comments: FormControl<string | null>;
  categoryTenderIds: FormControl<string>;
  displayLogo: FormControl<boolean>;
  companyLogoId: FormControl<null | string | number>;
  numberOfTenders: FormControl<number>;
  tenderType: FormControl<string>;
  tenderCategories: FormControl<(string | boolean)[]>;
  displayPosition: FormControl<number | null>;
  publishedDate: FormControl<string>;
  tenderDeadline: FormControl<string>;
  postedBy: FormControl<number | null>;
  sourcePerson: FormControl<number | null>;
};

@Component({
  selector: 'app-new-tender',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgxsmkDatepickerComponent,
    DropdownComponent,
    InputComponent,
    RadioComponent,
    CheckboxNew,
  ],
  templateUrl: './new-tender.html',
  styleUrl: './new-tender.css',
})
export class NewTender implements OnInit {
  private readonly router = inject(Router);
  private readonly companyApi = inject(CompanyNameSuggestion);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly storeData = inject(StoreDataService);
  protected readonly misApi = inject(MisApi);
  private readonly querySubject = new Subject<string>();

  wantToAddTender = signal(false);
  companyData = this.storeData.SELECTED_COMPANY;
  currentRoute = signal<string>(this.router.url);
  query = signal('');
  isFocused = signal(false);
  companyLogoData = signal<string[]>([]);

  tenderType = signal(TenderType);
  tenderCategory = signal(TenderCategory);
  displayPositions = signal<DropdownOption[]>(priorities);

  publishedDate = signal<DatepickerValue>(null);
  deadline = signal<DatepickerValue>(null);

  displayLogoOptions = signal([
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ]);

  newTenderForm = new FormGroup<TenderFormControls>({
    companyId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    showCompanyNameAs: new FormControl<string | null>(null, { validators: [Validators.required] }),
    companyNameBn: new FormControl<string | null>(null),
    tenderTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    tenderUrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    comments: new FormControl<string | null>(null),
    categoryTenderIds: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    displayLogo: new FormControl(false, { nonNullable: true }),
    companyLogoId: new FormControl<null | string | number>(null),
    numberOfTenders: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    tenderType: new FormControl('Government', { nonNullable: true, validators: [Validators.required] }),
    tenderCategories: new FormControl<(string | boolean)[]>([], { nonNullable: true }),
    displayPosition: new FormControl<number | null>(null, { validators: [Validators.required] }),
    publishedDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    tenderDeadline: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    postedBy: new FormControl<number | null>(null, { validators: [Validators.required] }),
    sourcePerson: new FormControl<number | null>(null, { validators: [Validators.required] }),
  });

  companyNameSuggestions = toSignal(
    this.querySubject.pipe(
      map((value) => value.trim()),
      debounceTime(150),
      distinctUntilChanged(),
      switchMap((query) =>
        query.length >= 2
          ? this.companyApi.companyNamesSuggestions(query).pipe(
              map((list) => list.slice(0, 8)),
              catchError(() => of([] as CompanySuggestion[]))
            )
          : of([] as CompanySuggestion[])
      )
    ),
    { initialValue: [] as CompanySuggestion[] }
  );

  postedBy = toSignal(
    this.misApi.getPostedBy().pipe(
      map((res) =>
        res.map((item): DropdownOption => ({
          label: item.fullName,
          value: item.userId,
        }))
      ),
      catchError(() => of([] as DropdownOption[]))
    ),
    { initialValue: [] as DropdownOption[] }
  );

  sourcePerson = toSignal(
    this.misApi.getSourcePersons().pipe(
      map((res) =>
        res.map((person): DropdownOption => ({
          label: person.fullName,
          value: person.depSerial,
        }))
      ),
      catchError(() => of([] as DropdownOption[]))
    ),
    { initialValue: [] as DropdownOption[] }
  );

  ngOnInit(): void {
    const sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute.set(event.urlAfterRedirects);
      }
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onQueryChange(value: string): void {
    this.wantToAddTender.set(false);
    this.query.set(value);
    this.querySubject.next(value);
  }

  onFocus(): void {
    this.isFocused.set(true);
    if (this.query().trim()) {
      this.querySubject.next(this.query());
    }
  }

  onBlur(): void {
    setTimeout(() => this.isFocused.set(false), 120);
  }

  selectCompany(data: CompanySuggestion): void {
    localStorage.setItem('SELECTED_COMPANY', JSON.stringify(data));
    this.storeData.SELECTED_COMPANY.set(data);
    this.query.set(data.companyName);
    this.isFocused.set(false);
    this.querySubject.next('');
    this.addTender();
  }

  clearCompany(): void {
    localStorage.removeItem('SELECTED_COMPANY');
    this.storeData.SELECTED_COMPANY.set(null);
    this.query.set('');
    this.querySubject.next('');
    this.companyLogoData.set([]);
    this.wantToAddTender.set(false);
    this.newTenderForm.patchValue({
      companyId: 0,
      companyName: '',
      showCompanyNameAs: null,
      companyNameBn: null,
      companyLogoId: null,
    });
  }

  addTender(): void {
    const selectedCompany = this.companyData();
    if (!selectedCompany) return;

    this.wantToAddTender.set(true);
    this.newTenderForm.patchValue({
      companyId: selectedCompany.comId,
      companyName: selectedCompany.companyName,
      showCompanyNameAs: selectedCompany.displayCompanyName,
      companyNameBn: selectedCompany.companyNameBng,
    });

    this.misApi.getCompanyLogo(selectedCompany.comId).subscribe({
      next: (res) => {
        const logoSource = res?.data?.[0]?.logoSource;
        this.companyLogoData.set(Array.isArray(logoSource) ? logoSource : []);
      },
      error: () => this.companyLogoData.set([]),
    });
  }

  onPublishedDateChange(val: DatepickerValue): void {
    this.publishedDate.set(val);
    this.newTenderForm.controls.publishedDate.setValue(this.datepickerToIso(val));
  }

  onTenderDeadlineChange(val: DatepickerValue): void {
    this.deadline.set(val);
    this.newTenderForm.controls.tenderDeadline.setValue(this.datepickerToIso(val));
  }

  submit(): void {
    if (this.newTenderForm.invalid) {
      this.newTenderForm.markAllAsTouched();
      return;
    }

    const raw = this.newTenderForm.getRawValue();
    const payload = {
      companyId: raw.companyId,
      companyName: raw.companyName,
      alternativeCompanyName: raw.showCompanyNameAs,
      alternativeCompanyNameBN: raw.companyNameBn,
      tenderTitle: raw.tenderTitle,
      tenderUrl: raw.tenderUrl,
      comments: raw.comments ?? '',
      categoryTenderIds: raw.categoryTenderIds,
      displayLogo: raw.displayLogo,
      logoSource: String(raw.companyLogoId ?? ''),
      totalTenders: raw.numberOfTenders,
      tenderType: raw.tenderType,
      tenderCategories: raw.tenderCategories,
      publishedOn: raw.publishedDate,
      deadline: raw.tenderDeadline,
      serialNo: Number(raw.displayPosition),
      postedBy: Number(raw.postedBy),
      referredBy: Number(raw.sourcePerson),
      pageMode: 'Add',
    };

    console.log('new tender payload', payload);
  }

  private datepickerToIso(val: DatepickerValue): string {
    if (!val) return '';
    if (val instanceof Date) return val.toISOString();

    if (typeof val === 'object' && 'start' in val) {
      const start = (val as { start?: unknown }).start;
      if (start instanceof Date) return start.toISOString();
    }

    return '';
  }
}
