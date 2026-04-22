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
import { error } from 'console';


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

  private hotJobId = signal<number>(0);
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
      const jobId = params.get('jobId');
      if (jobId) {
        this.misApi.getHotJobDataById(jobId).subscribe({
          next: (res) => {
            this.hotJobId.set(res.id);   // ← store the id
            console.log("get hot job data", res);
            this.populateForm(res);
          },
          error: (err) => {
            console.log("get hot job data error", err);
          }
        });
      }
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

    postedBy: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
    sourcePerson: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
  });

  
  onPublishedDateChange(val: DatepickerValue): void {
    this.PublishedDate.set(val);
    this.newHotJobForm.controls.publishedDate.setValue(this.datepickerToIso(val));
  }

  onJobDeadlineChange(val: DatepickerValue): void {
    this.Deadline.set(val);
    this.newHotJobForm.controls.jobDeadline.setValue(this.datepickerToIso(val));
  }

  onFromDateChange(val: DatepickerValue): void {
    this.FromDate.set(val);
    this.newHotJobForm.controls.PremiumStartOn.setValue(this.datepickerToIso(val));
  }

  onToDateChange(val: DatepickerValue): void {
    this.ToDate.set(val);
    this.newHotJobForm.controls.PremiumEndOn.setValue(this.datepickerToIso(val));
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
      Id: this.hotJobId(),              // ← from fetched response
      pageMode: 'Edit',                       // ← Edit mode
      comId: raw.companyId,
      companyName: raw.companyName,
      displayCompanyName: raw.showCompanyNameAs,
      displayCompanyNameBng: raw.companyNameBn,
      jobTitles: raw.jobTitle,
      jobTitlesBng: raw.jobTitle,                 // use same if no BN field
      linkPage: raw.hotJobsUrl,
      comments: raw.comments ?? '',
      jP_Ids: raw.categoryJobIds,
      showLogo: raw.displayLogo,
      jbLogoSource: String(raw.companyLogoId ?? ''),
      totalJobs: raw.numberOfJobs,
      totalWC: 0,
      totalBC: 0,
      totalComplementary: 0,
      totalHotJobsCM: 0,
      premiumJob: raw.hotJobsType === 'Premium' ? 1 : 0,
      blueCollerJob: opts.includes('BlueCollar'),
      complementaryJob: opts.includes('Complementary'),
      hotJobsCM: opts.includes('HotjobCM'),
      startDate: raw.PremiumStartOn || null,
      endDate: raw.PremiumEndOn || null,
      publishedOn: raw.publishedDate,
      deadLine: raw.jobDeadline,
      postedBy: raw.postedBy,       // already a number
      referredBy: raw.sourcePerson, // already a number
      serialNo: Number(raw.displayPosition),
    };

    console.log("payload", payload);

    // this.misApi.updateHotJob(payload).pipe(
    //   tap(d => console.log('response update hotjob -->', d))
    // ).subscribe();
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
        console.log("posted by", mapped);
      })
    ),
    { initialValue: [] }
  );
  
  sorcePerson = toSignal(
    this.misApi.getSourcePersons().pipe(
      map((res) =>
        res.map((person: any): DropdownOption => ({
            label: person.fullName,
            value: person.userId
          }))
      )
    ),
    { initialValue: [] }
  );

  private populateForm(res: any): void {
    // --- Build postedOptions array from booleans ---
    const opts: string[] = [];
    if (res.blueCollerJob) opts.push('BlueCollar');
    if (res.complementaryJob) opts.push('Complementary');
    if (res.hotJobsCM) opts.push('HotjobCM');

    // --- Patch only available fields ---
    this.newHotJobForm.patchValue({
      companyId: res.comId ?? this.newHotJobForm.value.companyId,
      companyName: res.companyName ?? this.newHotJobForm.value.companyName,
      showCompanyNameAs: res.displayCompanyName ?? this.newHotJobForm.value.showCompanyNameAs,
      companyNameBn: res.displayCompanyNameBng ?? this.newHotJobForm.value.companyNameBn,
      jobTitle: res.jobTitles ?? this.newHotJobForm.value.jobTitle,
      hotJobsUrl: res.linkPage ?? this.newHotJobForm.value.hotJobsUrl,
      comments: res.comments ?? null,
      categoryJobIds: res.jP_Ids ?? this.newHotJobForm.value.categoryJobIds,
      displayLogo: res.showLogo ?? false,
      companyLogoId: res.jbLogoSource ?? null,
      numberOfJobs: res.totalJobs ?? 0,
      hotJobsType: res.premiumJob === 1 ? 'Premium' : 'Normal',
      postedOptions: opts,
      displayPosition: res.serialNo != null ? String(res.serialNo) : this.newHotJobForm.value.displayPosition,
      publishedDate: res.publishedOn ?? '',
      jobDeadline: res.deadLine ?? '',
      PremiumStartOn: res.startDate ?? '',
      PremiumEndOn: res.endDate ?? '',
      postedBy: res.postedBy ?? 0,        // ← was String(res.postedBy)
      sourcePerson: res.referredBy ?? 0,  // ← was String(res.referredBy)
    });

    // --- Sync datepicker signals ---
    if (res.publishedOn) this.PublishedDate.set(new Date(res.publishedOn));
    if (res.deadLine) this.Deadline.set(new Date(res.deadLine));
    if (res.startDate) this.FromDate.set(new Date(res.startDate));
    if (res.endDate) this.ToDate.set(new Date(res.endDate));
  }
  

}

