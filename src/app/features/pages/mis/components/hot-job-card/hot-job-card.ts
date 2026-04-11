import { Component, input } from '@angular/core';
import { HotJob } from '../../models/jobs.data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hot-job-card',
  imports: [DatePipe],
  templateUrl: './hot-job-card.html',
  styleUrl: './hot-job-card.css',
})
export class HotJobCard {
  
  job = input.required<HotJob>();
}
