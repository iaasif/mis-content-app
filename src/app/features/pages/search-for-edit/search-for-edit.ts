import { Component, signal } from '@angular/core';
import { DropdownOption } from '../../../shared/models/models';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { FormControl } from '@angular/forms';
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";

@Component({
  selector: 'app-search-for-edit',
  imports: [NgxsmkDatepickerComponent, DropdownComponent],
  templateUrl: './search-for-edit.html',
  styleUrl: './search-for-edit.css',
})
export class SearchForEdit {
  jobType = signal(JobType)
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

