import { Component, signal } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RadioComponent } from "../../../shared/components/radio/radio.component";
import { TextEditorComponent } from "../../../shared/components/text-editor/text-editor.component";
import { DropdownOption, SelectRadioData } from '../../../shared/models/models';
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";

@Component({
  selector: 'app-new-job',
  imports: [InputComponent, InputComponent, RadioComponent, TextEditorComponent, DropdownComponent],
  templateUrl: './new-job.html',
  styleUrl: './new-job.css'
})
export class NewJob {
  hotJobsType = signal(Posted) 
  position = signal(priorities)
}

export const Posted: SelectRadioData[] = [
    {
      id: '1',
      label: 'Today',
      name: 'posted',
      
      
    },
    {
      id: '2',
      label: 'Last 2 days',
      name: 'posted',
      
      
    },

    {
      id: '3',
      label: 'Last 3 days',
      name: 'posted',
      
      
    },
    {
      id: '4',
      label: 'Last 4 days',
      name: 'posted',
      
      
    },
    {
      id: '5',
      label: 'Last 5 days',
      name: 'posted',
      
      
    },

  ]

 export const priorities: DropdownOption[] = [
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'High', value: 3 },
  { label: 'Urgent', value: 4 },
  { label: 'Critical', value: 5 }
];
