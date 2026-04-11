import { Component, signal } from '@angular/core';
import { priorities } from '../mis/utils/mis.data';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { DropdownOption } from '../../../shared/models/models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-job',
  imports: [NgxsmkDatepickerComponent, DropdownComponent],
  templateUrl: './edit-job.html',
  styleUrl: './edit-job.css',
})
export class EditJob {
  jobType= signal(JobType)
  FromDate = signal<DatepickerValue>(null);
  ToDate = signal<DatepickerValue>(null);
  
  test():void{
    console.log(this.FromDate(),this.ToDate())
  }
  data = data;

  testformcontrol = new FormControl
} 

const data= [
  {
    id:1,
    jobTitle:"corporate sales manager ",
    publishedDate:"2022-01-01",
    expiryDate:"2022-01-01",
    jobdeadline:"2022-01-01",
    displaypostion:10,
    totalJob :1,
    comments:"",
    
  },
  {
    id:2,
    jobTitle:"corporatee corporate sales manager corporate sales manager corporate sales manager corporate sales manager ee ",
    publishedDate:"2022-01-01",
    expiryDate:"2022-01-01",
    jobdeadline:"2022-01-01",
    displaypostion:10,
    totalJob :1,
    comments:"",
  },
  {
    id:3,
    jobTitle:"corporate asdfdasss",
    publishedDate:"2022-01-01",
    expiryDate:"2022-01-01",
    jobdeadline:"2022-01-01",
    displaypostion:10,
    totalJob :1,
    comments:"",
  }
]

export const JobType: DropdownOption[] = [
  {
    label: "All Jobs",
    value: "allJobs",
  },
  {
    label: "Active Jobs",
    value: "activeJobs",
  },
  {
    label: "Expired Jobs",
    value: "expiredJobs",
  },
];