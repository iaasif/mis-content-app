import { Component, signal } from '@angular/core';
import { HotJobForm } from '../../models/jobs.data';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMPANY_NAME, HotJobCategory, HotJobType, priorities } from '../../utils/mis.data';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { UploadFile } from "../upload-file/upload-file";
import { FileUploadComponent } from "../../../../../shared/components/file-upload/file-upload.component";


@Component({
  selector: 'app-add-compnay',
  imports: [RouterLink, ReactiveFormsModule, InputComponent, InputComponent, FormsModule, FileUploadComponent],
  templateUrl: './add-compnay.html',
  styleUrl: './add-compnay.css',
})
export class AddCompnay {
  readonly imagePayload: Record<string, string | File | undefined> = {
    id: 'idfromPayloadIMG',
    imageName: 'HotJobLogo',
    CompanyName: COMPANY_NAME,
  };
  hotJobCategory = signal(HotJobCategory);
  hotJobsType = signal(HotJobType);
  position = signal(priorities);

  // for Display Logo radio
  displayLogoOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  newHotJobForm = new FormGroup({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    companyNameBn: new FormControl('', { nonNullable: true }),
    companyLogo: new FormControl(false, { nonNullable: true }),
    logoSource: new FormControl('', { nonNullable: true }),
    logoSize: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
  });


  submit(): void {
    console.log('=== FORM SUBMISSION TRIGGERED ===');
    console.log('Form valid:', this.newHotJobForm.valid);
    console.log('Form status:', this.newHotJobForm.status)
    
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
    console.log('=== END SUBMISSION ===');
  }
}
