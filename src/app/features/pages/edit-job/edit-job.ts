import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RadioComponent } from "../../../shared/components/radio/radio.component";
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { HotJobType, HotJobCategory, priorities, deptId } from '../mis/utils/mis.data';
import { CheckboxNew } from "../../../shared/components/checkbox-new/checkbox-new";
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { CompanySuggestion, HotJobForm, HotJobFormControls } from '../mis/models/jobs.data';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map, tap } from 'rxjs';
import { CompanyNameSuggestion } from '../mis/services/company-name-suggestion';
import { StoreDataService } from '../mis/services/store-data-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MisApi } from '../mis/services/mis-api';
import { DropdownOption } from '../../../shared/models/models';


@Component({
  selector: 'app-edit-job',
  imports: [RouterLink, ReactiveFormsModule, DropdownComponent, NgxsmkDatepickerComponent, InputComponent, InputComponent, RadioComponent, DropdownComponent, CheckboxNew, FormsModule, CommonModule],
  templateUrl: './edit-job.html',
  styleUrl: './edit-job.css',
})
export class EditJob {
  private readonly activeRouter = inject(ActivatedRoute)
  private readonly router = inject(Router);
  private readonly companyApi = inject(CompanyNameSuggestion);
  private readonly destroyRef = inject(DestroyRef);
  protected storeData = inject(StoreDataService);
  protected misApi = inject(MisApi);

  wantToAddHotJob = signal(false); 
  companyData = this.storeData.SELECTED_COMPANY ?? null;
  currentRoute = signal<string>(this.router.url);
  query = signal('');
  isFocused = signal(false);
  companyNameSuggestions = signal<CompanySuggestion[]>([]);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  hotJobCategory = signal(HotJobCategory);
  hotJobsType = signal(HotJobType);
  position = signal(priorities);

  PublishedDate = signal<DatepickerValue>(null);
  Deadline = signal<DatepickerValue>(null);

  FromDate = signal<DatepickerValue>(null);
  ToDate = signal<DatepickerValue>(null);

  displayLogoOptions = signal([
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

    
    this.activeRouter.queryParamMap.subscribe(params => {
      const category = params.get('comID');
      console.log("get id",category);
    });
  }
  
  newHotJobForm = new FormGroup<HotJobFormControls>({
    companyId : new FormControl(0, {nonNullable: true,validators:[Validators.required]}),
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    showCompanyNameAs: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    companyNameBn: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),
    jobTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    hotJobsUrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    comments: new FormControl<string | null>(null),

    categoryJobIds: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    displayLogo: new FormControl(false, { nonNullable: true }),
    companyLogoId: new FormControl<null | string | number>(null),

    numberOfJobs: new FormControl(0, { nonNullable: true, validators: [Validators.min(0),Validators.required] }),

    hotJobsType: new FormControl('Normal', { nonNullable: true, validators: [Validators.required] }),

    postedOptions: new FormControl<(string | boolean)[]>([], { nonNullable: true }),

    displayPosition: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),

    publishedDate: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),
    jobDeadline: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),

    PremiumStartOn: new FormControl('', { nonNullable: true, validators: this.premiumValidator }),
    PremiumEndOn: new FormControl('', { nonNullable: true, validators: this.premiumValidator  }),

    postedBy: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),
    sourcePerson: new FormControl('', { nonNullable: true, validators: [Validators.required]  }),
  });

  
  onPublishedDateChange(val: DatepickerValue) {
    this.PublishedDate.set(val);
    const isoDate = this.datepickerToIso(val);
    this.newHotJobForm.controls.publishedDate.setValue(isoDate);
    console.log(isoDate)
  }
  
  onJobDeadlineChange(val: DatepickerValue) {
    this.Deadline.set(val);
    const isoDate = this.datepickerToIso(val);
    this.newHotJobForm.controls.jobDeadline.setValue(isoDate);
  }

  onFromDateChange(val: DatepickerValue) {
    this.FromDate.set(val);
    const isoDate = this.datepickerToIso(val);
    this.newHotJobForm.controls.PremiumStartOn.setValue(isoDate);
  }

  onToDateChange(val: DatepickerValue) {
    console.log('To date changed:', val);
    this.ToDate.set(val);
    const isoDate = this.datepickerToIso(val);
    console.log('Setting premiumEndDate to:', isoDate);
    this.newHotJobForm.controls.PremiumEndOn.setValue(isoDate);
  }

  private datepickerToIso(val: DatepickerValue): string {
    if (!val) return '';
    if (val instanceof Date) return val.toISOString();
    
    // @ts-ignore - depends on your lib's actual type
    if (val?.start instanceof Date) return val.start.toISOString();

    return '';
  }

  submit(): void {
    if (this.newHotJobForm.invalid) {
      this.newHotJobForm.markAllAsTouched();
      return;
    }
  
    const raw = this.newHotJobForm.getRawValue();
    const opts: (string | boolean)[] = raw.postedOptions ?? [];
  
    const payload = {
      companyId:               raw.companyId,
      companyName:             raw.companyName,
      alternativeCompanyName:  raw.showCompanyNameAs,       // renamed
      alternativeCompanyNameBN: raw.companyNameBn,          // renamed
      jobTitles:               raw.jobTitle,                // renamed (plural)
      jobTitlesBN:             '',                          // add a form control for this
      jobUrl:                  raw.hotJobsUrl,              // renamed
      comments:                raw.comments ?? '',
      categoryJobIds:          raw.categoryJobIds,
      displayLogo:             raw.displayLogo,
      logoSource:              String(raw.companyLogoId ?? ''), // renamed + string
      totalJobs:               raw.numberOfJobs,            // renamed
      whiteCollarCount:        0,                           // add form controls if needed
      blueCollarCount:         0,
      complementaryCount:      0,
      hotjobCMCount:           0,
      isPremium:               raw.hotJobsType === 'Premium',  // transformed
      isBlueCollar:            opts.includes('BlueCollar'),    // extracted from array
      isComplementary:         opts.includes('Complementary'),
      isHotjobCM:              opts.includes('HotjobCM'),
      startOn:                 raw.PremiumStartOn || null,   // renamed
      endOn:                   raw.PremiumEndOn || null,     // renamed
      publishedOn:             raw.publishedDate,              // renamed
      deadline:                raw.jobDeadline,               // renamed
      postedBy:                Number(raw.postedBy),           // ensure number
      referredBy:              Number(raw.sourcePerson),       // renamed
      serialNo:                Number(raw.displayPosition),    // renamed
      hotJobId:                0,
      pageMode:                'Add',
    };
    console.log("payloiad",payload)
  
    // this.misApi.addHotJob(payload).pipe(
    //   tap(d => console.log('response -->', d))
    // ).subscribe();
  }

  onQueryChange(value: string): void {
    this.wantToAddHotJob.set(false);
    this.query.set(value);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    if (!value.trim()) {
      this.companyNameSuggestions.set([]);
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.companyApi.companyNamesSuggestions(value.trim()).pipe(
        tap((res) => {
          console.log('API call for suggestions with query:', res);
        })
      ).subscribe({
        next: list => this.companyNameSuggestions.set(list.slice(0, 8)),
        error: () => this.companyNameSuggestions.set([]),
      });
    }, 150);
  }

  selectCompany(data: CompanySuggestion): void {
    localStorage.setItem('SELECTED_COMPANY', JSON.stringify(data));
    this.storeData.SELECTED_COMPANY.set(data);
    this.query.set(data.companyName);
    this.isFocused.set(false);
    this.companyNameSuggestions.set([]);
    console.log("data", data)
    console.log("selected company", this.storeData.SELECTED_COMPANY())
    console.log("this.suggestions", this.companyNameSuggestions())

  }

  clearCompany(): void {
    localStorage.removeItem('SELECTED_COMPANY');
    this.storeData.SELECTED_COMPANY.set(null);
    this.query.set('');
    this.companyNameSuggestions.set([]);
    
    this.wantToAddHotJob.set(false);
  }

  onFocus(): void {
    this.isFocused.set(true);
    const q = this.query().trim();
    if (q) {
      this.companyApi.companyNamesSuggestions(q).subscribe({
        next: list => this.companyNameSuggestions.set(list.slice(0, 8)),
        error: () => this.companyNameSuggestions.set([]),
      });
    }
  }

  onBlur(): void {
    setTimeout(() => this.isFocused.set(false), 120);
  }
  
  addHotJob():void{
    this.wantToAddHotJob.set(true);
    this.newHotJobForm.patchValue({
      companyId: this.companyData()?.comId,
      companyName :  this.companyData()?.companyName,
      showCompanyNameAs : this.companyData()?.displayCompanyName,
      companyNameBn: this.companyData()?.companyNameBng,
    })
  }

  private premiumValidator(group: AbstractControl) {
    const type = group.get('hotJobsType')?.value;
    const start = group.get('premiumStartDate')?.value;
    const end = group.get('premiumEndDate')?.value;
  
    if (type === 'Premium' && (!start || !end)) {
      return { premiumRequired: true };
    }
  
    return null;
  }
  isPremium = computed(() => this.hotJobsTypeSignal() === 'Premium');
  hotJobsTypeSignal = toSignal(
    this.newHotJobForm.get('hotJobsType')!.valueChanges,
    { initialValue: this.newHotJobForm.get('hotJobsType')!.value }
  );

  postedBy = toSignal(
    this.misApi.getPostedBy(deptId).pipe(
      map((res) =>
        res.map((item: any): DropdownOption => ({
          label: item.fullName,   // label = fullname
          value: item.userId      // value = userid
        }))
      ),
      tap((mapped) => {
        // console.log("posted by", mapped);
      })
    ),
    { initialValue: [] }
  );
  
  sorcePerson = toSignal(
    this.misApi.getSourcePersons().pipe(
      map((res) =>
        res.map((person: any): DropdownOption => ({
            label: person.fullName,
            value: person.depSerial
          }))
      )
    ),
    { initialValue: [] }
  );

}

