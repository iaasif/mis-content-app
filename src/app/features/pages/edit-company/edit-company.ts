import { Component, computed, inject, NgZone, OnInit, signal } from '@angular/core';
import { HotJobCategory, HotJobType, priorities } from '../mis/utils/mis.data';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { CompanySuggestion, CreateCompany, UploadImgApiResponse } from '../mis/models/jobs.data';
import { MisApi } from '../mis/services/mis-api';
import { StoreDataService } from '../mis/services/store-data-service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { CompanyNameSuggestion } from '../mis/services/company-name-suggestion';

@Component({
  selector: 'app-edit-company',
  imports: [ReactiveFormsModule, InputComponent, FileUploadComponent],
  templateUrl: './edit-company.html',
  styleUrl: './edit-company.css',
})
export class EditCompany implements OnInit {
  private companyNameService = inject(CompanyNameSuggestion);
  private misApi = inject(MisApi);
  private hotToast = inject(HotToastService);
  private storeDataService = inject(StoreDataService);
  private ngZone = inject(NgZone);

  isLoadingCompanies = signal(false);

  readonly imageApiUrl = 'https://api.bdjobs.com/ImageGenerator/api/Image/resize-store';

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

  
  protected nameValue = signal<string>('');

  readonly imgUploadPayload = computed<Record<string, string | number | undefined> | null>(() => {
    const name = this.nameValue();
    if (name && name.length > 0) {
      return {
        id: '-1',
        imageName: 'HotJobLogo',
        CompanyName: name,
      };
    }
    return null;
  });

  // ---- Company search ----

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
      )
    ),
    { initialValue: { query: '', suggestions: [] as CompanySuggestion[] } }
  );

  shouldShowList = computed(() => {
    const { query } = this.companySuggestState();
    return (this.companyId() === 0 && query.length >= 1) || this.isLoadingCompanies();
  });

  // ---- Lifecycle ----

  ngOnInit(): void {
    this.editCompanyForm.controls.companyName.valueChanges
      .pipe(startWith(this.editCompanyForm.controls.companyName.value ?? ''))
      .subscribe((value) => {
        this.nameValue.set(value ?? '');
      });
  }

  // ---- Form actions ----

  submit(): void {
    if (this.editCompanyForm.invalid) {
      this.hotToast.error('Please fill all required fields');
      this.editCompanyForm.markAllAsTouched();
      return;
    }

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

    this.misApi.updateCompany(payload).pipe(
      map(res=>{
        console.log('update company',res)
        if(res.message==="Company updated successfully!"){
          this.hotToast.success("Company Update Successfully")
        }
      })
    ).subscribe()
    console.log('payload', payload);
  }

  onImageResponse(res: UploadImgApiResponse): void {
    const variants = res.variants ?? [];
    console.log('variants', variants);
    this.editCompanyForm.controls.logoSource.setValue(variants[0]?.publicUrl || '');
  }

  selectCompany(company: CompanySuggestion): void {
    console.log('selectCompany', company);
    this.searchCompanyQuery.setValue(company.companyName, { emitEvent: false });
    this.isLoadingCompanies.set(false);
    this.companyId.set(company.comId);

    this.misApi.getCompanyById(company.comId).subscribe({
      next: (res) => {
        console.log('getCompanyById', res);
        this.ngZone.run(() => {
          this.populateForm(res.data);
        });
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  onCompanyInput(): void {
    if (this.companyId() !== 0) {
      this.companyId.set(0);
    }
  }

  populateForm(company: any): void {
    this.editCompanyForm.patchValue({
      companyName: company.companyName,
      companyNameBng: company.companyNameBng,
      logoSource: company.logoSource,
      logoH: company.logoH,
      logoW: company.logoW,
      logoSize: company.logoSize,
      logoSourceLocal: company.logoSourceLocal,
    });
  }
}