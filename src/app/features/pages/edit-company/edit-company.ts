import { Component, computed, inject, signal } from '@angular/core';
import { HotJobCategory, HotJobType, priorities } from '../mis/utils/mis.data';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, startWith, switchMap, tap } from 'rxjs';
import { CompanySuggestion, CreateCompany, UploadImgApiResponse } from '../mis/models/jobs.data';
import { MisApi } from '../mis/services/mis-api';
import { StoreDataService } from '../mis/services/store-data-service';
import { InputComponent } from "../../../shared/components/input/input.component";
import { FileUploadComponent } from "../../../shared/components/file-upload/file-upload.component";
import { CompanyNameSuggestion } from '../mis/services/company-name-suggestion';

@Component({
  selector: 'app-edit-company',
  imports: [ReactiveFormsModule, InputComponent, FileUploadComponent],
  templateUrl: './edit-company.html',
  styleUrl: './edit-company.css',
})
export class EditCompany {
  private companyNameService = inject(CompanyNameSuggestion);
  private misApi = inject(MisApi);
  private hotToast = inject(HotToastService);
  private storeDataService = inject(StoreDataService);
  isLoadingCompanies = signal(false);


  readonly imageApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/resize-store';

  readonly imagePayload: Record<string, string | File | undefined> = {
    id: 'idfromPayloadIMG',
    imageName: 'HotJobLogo',
    CompanyName: this.storeDataService.SELECTED_COMPANY()?.companyName ?? '',
  };

  readonly hotJobCategory = signal(HotJobCategory);
  readonly hotJobsType = signal(HotJobType);
  readonly position = signal(priorities);

  readonly displayLogoOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];


  editCompanyForm = new FormGroup({
    companyName: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    companyNameBng: new FormControl<string | null>(null),

    logoSourceLocal: new FormControl<string | null>(null),
    logoSource: new FormControl<string | null>('', {
      validators: [Validators.required],
    }),

    logoH: new FormControl<number | null>(null, {
      validators: [Validators.min(0), Validators.max(255)],
    }),
    logoW: new FormControl<number | null>(null, {
      validators: [Validators.min(0), Validators.max(255)],
    }),

    logoSize: new FormControl<number | null>(null, {
      validators: [Validators.min(0), Validators.max(32767)],
    }),
    companyId: new FormControl(0),

  });

  protected nameValue = toSignal(
    this.editCompanyForm.controls.companyName.valueChanges.pipe(
      startWith(this.editCompanyForm.controls.companyName.value ?? ''),
      tap(value => console.log('nameValue', value))
    )
  );
  // will work later  here 
  readonly imgUploadPayload = computed<Record<string, string | number | undefined> | null>(() => {
    const name = this.nameValue();
    if (name && name.length > 0) {
      return {
        id: '-1',
        imageName: 'HotJobLogo',
        CompanyName: name
      };
    }

    return null;
  });

  submit(): void {
    // console.log('submit');
    // console.log('imgUploadPayload', this.imgUploadPayload());
    // console.log('form values', this.newCompanyForm.value);
    // console.log('-----------------------------------------------');
    // console.log('1. raw form value:', this.newCompanyForm.controls.companyName.value);
    // console.log('2. nameValue signal:', this.nameValue());
    // console.log('3. imgUploadPayload:', this.imgUploadPayload());

    if (this.editCompanyForm.invalid) {
      this.hotToast.error('Please fill all required fields');
      this.editCompanyForm.markAllAsTouched();
      return;
    }
    // console.log('formValue', this.editCompanyForm.getRawValue(), this.editCompanyForm.valid);

    const formValue = this.editCompanyForm.getRawValue();

    const payload: CreateCompany = {
      CompanyName: formValue.companyName || '',
      LogoSource: formValue.logoSource || '',
      LogoH: formValue.logoH || 0,
      LogoW: formValue.logoW || 0,
      LogoSize: formValue.logoSize || 0,
      LogoSourceLocal: formValue.logoSourceLocal || '',
      CompanyNameBng: formValue.companyNameBng || '',
    };

    console.log('payload', payload);

   
  }



  onImageResponse(res: UploadImgApiResponse): void {
    const variants = res.variants ?? [];
    // this.storeDataService.storeImgData(variants);
    console.log('variants', variants);
    this.editCompanyForm.controls.logoSource.setValue(variants[0]?.publicUrl || '');
  }

  companyId = signal(0);
  companies = computed(() => this.companySuggestState().suggestions);
  searchCompanyQuery = new FormControl('');

  private companySuggestState = toSignal(
    this.searchCompanyQuery.valueChanges.pipe(
      map((value) => value?.trim() ?? ''),
      debounceTime(300),
      distinctUntilChanged(),
      tap((query) => {
        if (query.length >= 2) this.isLoadingCompanies.set(true);

      }),
      switchMap((query) =>
        query.length >= 2
          ? this.companyNameService.companyNamesSuggestions(query).pipe(
            map((suggestions) => {
              this.isLoadingCompanies.set(false);
              return { query, suggestions };
            }),
            catchError(() => of({ query, suggestions: [] as CompanySuggestion[] })),
            finalize(() => this.isLoadingCompanies.set(false))
          )
          : of({ query, suggestions: [] as CompanySuggestion[] }).pipe(
            finalize(() => this.isLoadingCompanies.set(false))
          )
      ),
    ),
    { initialValue: { query: '', suggestions: [] as CompanySuggestion[] } }
  );


  shouldShowList = computed(() => {
    const { query, suggestions } = this.companySuggestState();
    return this.companyId() === 0 && query.length >= 1 || this.isLoadingCompanies();
  });

  selectCompany(company: CompanySuggestion): void {
    console.log('selectCompany', company);
    this.searchCompanyQuery.setValue(company.companyName, { emitEvent: false });
    this.isLoadingCompanies.set(false);
    this.companyId.set(company.comId);
  }

  onCompanyInput(): void {
    console.log('onCompanyInput');
    if (this.companyId() !== 0) {
      this.companyId.set(0);
    }
  }
}
