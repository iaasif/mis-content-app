import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { catchError, map, of } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DropdownComponent } from '../../../shared/components/dropdown-component/dropdown-component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { RadioComponent } from '../../../shared/components/radio/radio.component';
import { CheckboxNew } from '../../../shared/components/checkbox-new/checkbox-new';
import { DropdownOption, SelectRadioData } from '../../../shared/models/models';
import { priorities } from '../mis/utils/mis.data';
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

type EditTenderFormControls = {
  Id: FormControl<number | string | null>;
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
  selector: 'app-edit-tender',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgxsmkDatepickerComponent,
    DropdownComponent,
    InputComponent,
    RadioComponent,
    CheckboxNew,
  ],
  templateUrl: './edit-tender.html',
  styleUrl: './edit-tender.css',
})
export class EditTender implements OnInit {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly misApi = inject(MisApi);

  tenderType = signal(TenderType);
  tenderCategory = signal(TenderCategory);
  displayPositions = signal<DropdownOption[]>(priorities);
  companyLogoData = signal<string[]>([]);

  publishedDate = signal<DatepickerValue>(null);
  deadline = signal<DatepickerValue>(null);

  displayLogoOptions = signal([
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ]);

  editTenderForm = new FormGroup<EditTenderFormControls>({
    Id: new FormControl<number | string | null>(null),
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
    this.activeRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => this.patchFromQueryParams(params));
  }

  onPublishedDateChange(val: DatepickerValue): void {
    this.publishedDate.set(val);
    this.editTenderForm.controls.publishedDate.setValue(this.datepickerToIso(val));
  }

  onTenderDeadlineChange(val: DatepickerValue): void {
    this.deadline.set(val);
    this.editTenderForm.controls.tenderDeadline.setValue(this.datepickerToIso(val));
  }

  submit(): void {
    if (this.editTenderForm.invalid) {
      this.editTenderForm.markAllAsTouched();
      return;
    }

    const raw = this.editTenderForm.getRawValue();
    const payload = {
      id: raw.Id,
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
      pageMode: 'Edit',
    };

    console.log('edit tender payload', payload);
  }

  private patchFromQueryParams(params: ParamMap): void {
    const tenderId = params.get('tenderId') ?? params.get('id');
    const companyId = this.toNumber(params.get('companyId'));
    const displayPosition = this.toNumber(params.get('displayPosition'));
    const postedBy = this.toNumber(params.get('postedBy'));
    const sourcePerson = this.toNumber(params.get('sourcePerson'));
    const numberOfTenders = this.toNumber(params.get('numberOfTenders'));
    const publishedDate = params.get('publishedDate');
    const tenderDeadline = params.get('tenderDeadline');

    this.editTenderForm.patchValue({
      Id: tenderId,
      companyId: companyId ?? this.editTenderForm.controls.companyId.value,
      companyName: params.get('companyName') ?? this.editTenderForm.controls.companyName.value,
      showCompanyNameAs: params.get('showCompanyNameAs') ?? this.editTenderForm.controls.showCompanyNameAs.value,
      companyNameBn: params.get('companyNameBn') ?? this.editTenderForm.controls.companyNameBn.value,
      tenderTitle: params.get('tenderTitle') ?? this.editTenderForm.controls.tenderTitle.value,
      tenderUrl: params.get('tenderUrl') ?? this.editTenderForm.controls.tenderUrl.value,
      comments: params.get('comments') ?? this.editTenderForm.controls.comments.value,
      categoryTenderIds: params.get('categoryTenderIds') ?? this.editTenderForm.controls.categoryTenderIds.value,
      companyLogoId: params.get('companyLogoId') ?? this.editTenderForm.controls.companyLogoId.value,
      numberOfTenders: numberOfTenders ?? this.editTenderForm.controls.numberOfTenders.value,
      tenderType: params.get('tenderType') ?? this.editTenderForm.controls.tenderType.value,
      displayPosition: displayPosition ?? this.editTenderForm.controls.displayPosition.value,
      publishedDate: publishedDate ?? this.editTenderForm.controls.publishedDate.value,
      tenderDeadline: tenderDeadline ?? this.editTenderForm.controls.tenderDeadline.value,
      postedBy: postedBy ?? this.editTenderForm.controls.postedBy.value,
      sourcePerson: sourcePerson ?? this.editTenderForm.controls.sourcePerson.value,
    });

    if (publishedDate) this.publishedDate.set(new Date(publishedDate));
    if (tenderDeadline) this.deadline.set(new Date(tenderDeadline));
    if (companyId) this.loadCompanyLogos(companyId);
  }

  private loadCompanyLogos(companyId: number): void {
    this.misApi.getCompanyLogo(companyId).subscribe({
      next: (res) => {
        const logoSource = res?.data?.[0]?.logoSource;
        this.companyLogoData.set(Array.isArray(logoSource) ? logoSource : []);
      },
      error: () => this.companyLogoData.set([]),
    });
  }

  private toNumber(value: string | null): number | null {
    if (!value) return null;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? null : numberValue;
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
