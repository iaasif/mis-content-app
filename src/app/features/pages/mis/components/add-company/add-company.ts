import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMPANY_NAME, HotJobCategory, HotJobType, priorities } from '../../utils/mis.data';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { FileUploadComponent } from "../../../../../shared/components/file-upload/file-upload.component";
import { MisApi } from '../../services/mis-api';
import { CreateCompany } from '../../models/jobs.data';


@Component({
  selector: 'app-add-company',
  imports: [ReactiveFormsModule, InputComponent, FileUploadComponent],
  templateUrl: './add-company.html',
  styleUrl: './add-company.css',
})
export class AddCompany {
  private misApi = inject(MisApi);
  readonly imagePayload: Record<string, string | File | undefined> = {
    id: 'idfromPayloadIMG',
    imageName: 'HotJobLogo',
    CompanyName: COMPANY_NAME(),
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
      nonNullable: true,
      validators: [Validators.required],
    }),
    companyNameBng: new FormControl<string | null>(null),

    logoSourceLocal: new FormControl<string | null>(null),
    logoSource: new FormControl<string | null>(null),

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
      this.newCompanyForm.markAllAsTouched();
      return;
    }

    const formValue = this.newCompanyForm.getRawValue();

    const payload: CreateCompany = {
      CompanyName: 'a',
     
      LogoSource: 'a',

    };

    console.log('payload', payload);

    this.misApi.addCompany(payload).subscribe({
      next: (res) => {
        console.log('res', res);
      },
      error: (err) => {
        console.log('status', err.status);
        console.log('err', err.error);
      },
    });
  }
}
