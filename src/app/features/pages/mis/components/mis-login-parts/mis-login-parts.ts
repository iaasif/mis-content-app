import { Component, input, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IJobs } from '../../models/jobs.data';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotJobCategory, HotJobType, priorities } from '../../utils/mis.data';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { FileUploadComponent } from "../../../../../shared/components/file-upload/file-upload.component";
import { MisApi } from '../../services/mis-login-api';
import { CreateCompany } from '../../models/mis-login.data';
import { HotToastService } from '@ngxpert/hot-toast';






@Component({
  selector: 'app-hot-jobs-and-tender',
  imports: [RouterLink,ReactiveFormsModule, InputComponent],
  templateUrl: './mis-login-parts.html',
  styleUrl: './mis-login-parts.css'
})
export class HotJobsAndTender {
  title = input<string>('');
  items = input<IJobs[]>([]);
  bgColor = input('')
  hoverBg = input('')
  titleBg = input('')
  borderColor = input('')

  isExternal(url: string | undefined): boolean {
    return !!url && (url.startsWith('http') || url.startsWith('https'));
  }
//}

//export class AddCompany {
  private misApi = inject(MisApi);
  private hotToast = inject(HotToastService);


  readonly hotJobCategory = signal(HotJobCategory);
  readonly hotJobsType = signal(HotJobType);
  readonly position = signal(priorities);

  readonly displayLogoOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  newCompanyForm = new FormGroup({
    USER_NAME: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    UPASS: new FormControl<string | null>(null),




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
      USER_NAME: formValue.USER_NAME || '',

      UPASS: formValue.UPASS || '',
    };

    console.log('payload', payload);

    this.misApi.addCompany(payload).subscribe({
      next: (res:any) => {
        console.log('res', res);
        console.log('res', res['message'] );
        var messageReceived = res['message'];
        var messageToShow = "";
        if(messageReceived == "Logged In successfully!" ) 
        {
          this.hotToast.success('Logged In successfully');
          this.newCompanyForm.reset();
        }
        else{
          this.hotToast.warning('Something wrong happened');
        }
        
        
      },
      error: (err) => {
        console.log('status', err.status);
        console.log('err', err.error);
        this.hotToast.error('Failed to Log IN ');
      },
    });
  }
}