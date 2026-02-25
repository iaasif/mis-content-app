import { Component, signal } from '@angular/core';
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { priorities } from '../mis/utils/mis.data';
import { DatepickerValue, NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-edit-job',
  imports: [DropdownComponent,NgxsmkDatepickerComponent],
  templateUrl: './edit-job.html',
  styleUrl: './edit-job.css',
})
export class EditJob {
  position = signal(priorities);
  FromDate = signal<DatepickerValue>(null);
  ToDate = signal<DatepickerValue>(null);
  
  test():void{
    console.log(this.FromDate(),this.ToDate())
  }
  data = data;
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
