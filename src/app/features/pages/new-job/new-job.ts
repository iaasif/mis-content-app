import { Component, signal } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RadioComponent } from "../../../shared/components/radio/radio.component";
import { TextEditorComponent } from "../../../shared/components/text-editor/text-editor.component";
import { DropdownOption, SelectRadioData } from '../../../shared/models/models';
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { Posted, priorities } from '../mis/utils/mis.data';

@Component({
  selector: 'app-new-job',
  imports: [InputComponent, InputComponent, RadioComponent, DropdownComponent],
  templateUrl: './new-job.html',
  styleUrl: './new-job.css'
})
export class NewJob {
  hotJobsType = signal(Posted) 
  position = signal(priorities)
}

