import { Component, signal } from '@angular/core';
import { DropdownComponent } from "../../../shared/components/dropdown-component/dropdown-component";
import { priorities } from '../mis/utils/mis.data';

@Component({
  selector: 'app-edit-job',
  imports: [DropdownComponent],
  templateUrl: './edit-job.html',
  styleUrl: './edit-job.css',
})
export class EditJob {
  position = signal(priorities)

}
