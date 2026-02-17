import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IJobs } from '../../models/jobs.data';

@Component({
  selector: 'app-hot-jobs-and-tender',
  imports: [RouterLink],
  templateUrl: './hot-jobs-and-tender.html',
  styleUrl: './hot-jobs-and-tender.css'
})
export class HotJobsAndTender {
  title = input<string>('');
  items = input<IJobs[]>([]);
  bgColor = input('')
  hoverBg = input('')
  titleBg = input('')
  borderColor = input('')

  isExternal(url: string | undefined): boolean {
    return !!url && (url.startsWith('http') || url.startsWith('https'));
  }
}
