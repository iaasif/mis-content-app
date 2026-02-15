import { Component, signal } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RadioComponent } from "../../../shared/components/radio/radio.component";
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { HotJobType, Posted, priorities } from '../mis/utils/mis.data';
import { CheckboxNew } from "../../../shared/components/checkbox-new/checkbox-new";

@Component({
  selector: 'app-new-job',
  imports: [InputComponent, InputComponent, RadioComponent, DropdownComponent, CheckboxNew],
  templateUrl: './new-job.html',
  styleUrl: './new-job.css'
})
export class NewJob {
  posted = signal(Posted) 
  hotJobsType =  signal(HotJobType)
  position = signal(priorities)
}

