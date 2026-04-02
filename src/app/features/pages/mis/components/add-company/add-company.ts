import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotJobCategory, HotJobType, priorities } from '../../utils/mis.data';
import { InputComponent } from '../../../../../shared/components/input/input.component';

import { MisApi } from '../../services/mis-api';
import { CreateCompany } from '../../models/jobs.data';
import { HotToastService } from '@ngxpert/hot-toast';
import { StoreDataService } from '../../services/store-data-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-company',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './add-company.html',
  styleUrl: './add-company.css',
})
export class AddCompany {
  private misApi = inject(MisApi);
  private hotToast = inject(HotToastService);
  private storeDataService = inject(StoreDataService);

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

  newCompanyForm = new FormGroup({
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
  });


  submit(): void {
    if (this.newCompanyForm.invalid) {
      this.hotToast.error('Please fill all required fields');
      this.newCompanyForm.markAllAsTouched();
      return;
    }
    console.log('formValue', this.newCompanyForm.getRawValue(), this.newCompanyForm.valid);

    const formValue = this.newCompanyForm.getRawValue();

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

    this.misApi.addCompany(payload).subscribe({
      next: (res) => {
        console.log('res', res);
        this.hotToast.success('Company added successfully');
        this.newCompanyForm.reset();
      },
      error: (err) => {
        console.log('status', err.status);
        console.log('err', err.error);
        this.hotToast.error('Failed to add company');
      },
    });
  }

}
