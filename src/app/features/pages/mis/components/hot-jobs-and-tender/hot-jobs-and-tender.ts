import { Component, ContentChild, input, TemplateRef } from '@angular/core';
import { Hotjobs } from '../../utils/mis.data';
import { CommonModule, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-hot-jobs-and-tender',
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './hot-jobs-and-tender.html',
  styleUrl: './hot-jobs-and-tender.scss'
})
export class HotJobsAndTender {
  title = input<string>('');
  items = input<any[]>([]);
    @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;

}
