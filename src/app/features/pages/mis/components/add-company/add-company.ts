import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotJobCategory, HotJobType, priorities } from '../../utils/mis.data';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { MisApi } from '../../services/mis-api';
import { CreateCompany, UploadImgApiResponse } from '../../models/jobs.data';
import { HotToastService } from '@ngxpert/hot-toast';
import { StoreDataService } from '../../services/store-data-service';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, tap } from 'rxjs';

@Component({
  selector: 'app-add-company',
  imports: [ReactiveFormsModule, InputComponent,FileUploadComponent],
  templateUrl: './add-company.html',
  styleUrl: './add-company.css',
})
export class AddCompany {
  private misApi = inject(MisApi);
  private hotToast = inject(HotToastService);
  private storeDataService = inject(StoreDataService);

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

  protected  nameValue = toSignal(
    this.newCompanyForm.controls.companyName.valueChanges.pipe(
      startWith(this.newCompanyForm.controls.companyName.value ?? ''),
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
        // console.log('res', res);
        this.hotToast.success('Company added successfully');
        this.newCompanyForm.reset();
      },
      error: (err) => {
        console.log('err-------->', err);
        console.log('status', err.status);
        console.log('err', err.error);
        this.hotToast.error('Failed to add company');
      },
    });
  }

  
 
  onImageResponse(res: UploadImgApiResponse): void {
    const variants = res.variants ?? [];
    // this.storeDataService.storeImgData(variants);
    console.log('variants', variants);
    this.newCompanyForm.controls.logoSource.setValue(variants[0]?.publicUrl || '');
  }
}
