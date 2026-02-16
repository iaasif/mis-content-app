import { Component, signal } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RadioComponent } from "../../../shared/components/radio/radio.component";
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { HotJobType, HotJobCategory, priorities } from '../mis/utils/mis.data';
import { CheckboxNew } from "../../../shared/components/checkbox-new/checkbox-new";
import { FormControl,FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { HotJobForm, HotJobFormControls } from '../mis/models/jobs.data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-job',
  imports: [RouterLink,ReactiveFormsModule, DropdownComponent,NgxsmkDatepickerComponent,InputComponent, InputComponent, RadioComponent, DropdownComponent, CheckboxNew, FormsModule
  ],
  templateUrl: './new-job.html',
  styleUrl: './new-job.css'
})  
export class NewJob {
  hotJobCategory = signal(HotJobCategory);
  hotJobsType = signal(HotJobType);
  position = signal(priorities);

  FromDate = signal<DatepickerValue>(null);
  ToDate = signal<DatepickerValue>(null);

  // for Display Logo radio
  displayLogoOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  newHotJobForm = new FormGroup<HotJobFormControls>({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    showCompanyNameAs: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    companyNameBn: new FormControl('', { nonNullable: true }),
    jobTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    jobTitleBn: new FormControl('', { nonNullable: true }),

    hotJobsUrl: new FormControl('', { nonNullable: true }),
    comments: new FormControl('', { nonNullable: true }),

    categoryJobIds: new FormControl('', { nonNullable: true }),

    displayLogo: new FormControl(false, { nonNullable: true }),
    companyLogoId: new FormControl<null | string | number>(null),

    numberOfJobs: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),

    hotJobsType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    // you are using this as checkbox selected values (fine, but type should match your component)
    postedOptions: new FormControl<Array<Array<any>>>([], { nonNullable: true }),

    displayPosition: new FormControl('', { nonNullable: true }),

    publishedDate: new FormControl('', { nonNullable: true }),
    jobDeadline: new FormControl('', { nonNullable: true }),

    premiumStartDate: new FormControl('', { nonNullable: true }),
    premiumEndDate: new FormControl('', { nonNullable: true }),

    postedBy: new FormControl('', { nonNullable: true }),
    sourcePerson: new FormControl('', { nonNullable: true }),
  });

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
}
