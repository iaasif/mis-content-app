import { Component, effect, inject, signal } from '@angular/core';
import { MisApi } from '../../services/mis-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { HotJob } from '../../models/jobs.data';
import { map } from 'rxjs';
import { splitingJobTitles } from '../../../../../shared/utils/functions';

@Component({
  selector: 'app-rearrange-hot-job',
  standalone: true,
  imports: [],
  templateUrl: './rearrange-hot-job.html',
  styleUrl: './rearrange-hot-job.css',
})
export class RearrangeHotJob {
  private misService = inject(MisApi);

  private dragSourceIndex = signal<number | null>(null);
  dragOverIndex = signal<number | null>(null);
  cards = signal<HotJob[]>([]);

  hotJobs = toSignal(
    this.misService.getAllHotJobs().pipe(
      map(data =>
        data.map((job, i) => ({
          ...job,
          jobTitleList: splitingJobTitles(job.jobTitles),
          newSerial: i + 1,
        }))
      )
    ),
    { initialValue: [] as HotJob[] }
  );

  constructor() {
    // effect() called directly inside constructor = valid injection context
    effect(() => {
      const jobs = this.hotJobs();
      if (jobs.length && !this.cards().length) {
        this.cards.set([...jobs]);
      }
    });
  }

  onDragStart(index: number): void {
    this.dragSourceIndex.set(index);
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    this.dragOverIndex.set(index);
  }

  onDragLeave(): void {
    this.dragOverIndex.set(null);
  }

  onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    const sourceIndex = this.dragSourceIndex();

    if (sourceIndex === null || sourceIndex === targetIndex) {
      this.dragOverIndex.set(null);
      return;
    }

    this.swapCards(sourceIndex, targetIndex);
    this.dragOverIndex.set(null);
    this.dragSourceIndex.set(null);
  }

  onDragEnd(): void {
    this.dragSourceIndex.set(null);
    this.dragOverIndex.set(null);
  }

  private swapCards(sourceIndex: number, targetIndex: number): void {
    const updated = [...this.cards()];
    [updated[sourceIndex], updated[targetIndex]] =
      [updated[targetIndex], updated[sourceIndex]];
    this.cards.set(updated);
  }

  isDragging(index: number): boolean {
    return this.dragSourceIndex() === index;
  }

  isDragOver(index: number): boolean {
    return this.dragOverIndex() === index;
  }

  cardClass(index: number): string {
    const base = `
      group relative bg-white dark:bg-gray-900
      border rounded-xl p-4 cursor-grab active:cursor-grabbing
      transition-all duration-150 select-none
    `;
    if (this.isDragging(index)) {
      return base + ' opacity-40 scale-95 border-gray-200 dark:border-gray-700';
    }
    if (this.isDragOver(index)) {
      return base + ' border-purple-500 bg-purple-50 dark:bg-purple-950 scale-[1.03] shadow-md shadow-purple-200 dark:shadow-purple-900';
    }
    return base + ' border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500';
  }

  trackById(_: number, job: HotJob): number {
    return job.id;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: '2-digit'
    });
  }
}

