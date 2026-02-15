import { Component, signal, OnInit, inject } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RadioComponent } from "../../../shared/components/radio/radio.component";
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { HotJobType, Posted, priorities } from '../mis/utils/mis.data';
import { CheckboxNew } from "../../../shared/components/checkbox-new/checkbox-new";
import { FormControl,FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-new-job',
  imports: [DropdownComponent,NgxsmkDatepickerComponent,InputComponent, InputComponent, RadioComponent, DropdownComponent, CheckboxNew, FormsModule
  ],
  templateUrl: './new-job.html',
  styleUrl: './new-job.css'
})
export class NewJob {
  fb = inject(FormBuilder)
  jobForm!: FormGroup<any>;

  posted = signal(Posted) 
  hotJobsType =  signal(HotJobType)
  position = signal(priorities)

  companyName = new FormControl 

  FromDate = signal<DatepickerValue>(null);
  ToDate = signal<DatepickerValue>(null);
  
  test():void{
    console.log(this.FromDate(),this.ToDate())
  }
  

}
const d = {
  companyName: '',
  showCompanyNameAs: '',
  companyNameBn: '',
  jobTitle: '',
  jobTitleBn: '',
  hotJobsUrl: '',
  comments: '',
  categoryJobIds: '',
  displayLogo: false,
  companyLogoId: null,
  numberOfJobs: 1,
  hotJobsType: '',
  postedOptions: [[]],
  displayPosition: '',
  publishedDate: '',
  jobDeadline: '',
  premiumStartDate: '',
  premiumEndDate: '',
  postedBy: '',
  sourcePerson: ''
}
