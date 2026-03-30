import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Component, inject, OnInit } from '@angular/core';
import { MisApi } from '../../services/mis-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { HotJob } from '../../models/jobs.data';
import { tap } from 'rxjs';

function distribute<T>(items: T[], columns: number): T[][] {
  const result: T[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => result[i % columns].push(item));
  return result;
}

@Component({
  selector: 'app-rearrange-hot-job',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './rearrange-hot-job.html',
  styleUrl: './rearrange-hot-job.css',
})
export class RearrangeHotJob implements OnInit {
  private misService = inject(MisApi);

  private source: string[] = [
    'Get to work', 'Pick up groceries', 'Go home', 'Fall asleep',
    'Get up', 'Brush teeth', 'Take a shower', 'Check e-mail',
    'Walk dog', 'good', 'bad', 'joss', 'nice', 'lol',
    'one', 'two', 'three', 'four', 'five',
  ];

  columns: string[][] = [];

  hotJobs = toSignal(
    this.misService.getHotJobs().pipe(
      tap(res => console.log('res-->', res))
    ),
    { initialValue: [] as HotJob[] }
  );

  ngOnInit(): void {
    this.columns = distribute(this.source, 4);
  }

  noEnter = () => false;

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      const data = [...event.container.data];
      [data[event.previousIndex], data[event.currentIndex]] =
        [data[event.currentIndex], data[event.previousIndex]];
      this.columns[this.columns.indexOf(event.container.data)] = data;
    } else {
      const from = [...event.previousContainer.data];
      const to = [...event.container.data];
      [from[event.previousIndex], to[event.currentIndex]] =
        [to[event.currentIndex], from[event.previousIndex]];
      this.columns[this.columns.indexOf(event.previousContainer.data)] = from;
      this.columns[this.columns.indexOf(event.container.data)] = to;
    }
  }
}