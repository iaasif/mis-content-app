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
  
  test(){
    console.log(this.FromDate(),this.ToDate())
  }
} 
