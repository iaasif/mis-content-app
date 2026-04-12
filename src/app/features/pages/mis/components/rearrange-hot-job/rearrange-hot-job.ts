import { Component, effect, inject, signal } from '@angular/core';
import { MisApi } from '../../services/mis-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { HotJob } from '../../models/jobs.data';
import { map, tap } from 'rxjs';
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
      ),
      tap(c=>console.log('tap tap',c))
      
    ),
    { initialValue: [] as HotJob[] }
  );

  private readonly colorPalette = [
    'border-violet-200 bg-violet-100 hover:border-violet-400',
    'border-sky-200 bg-sky-100 hover:border-sky-400', 
    'border-emerald-200 bg-emerald-100 hover:border-emerald-400',
    'border-amber-200 bg-amber-100 hover:border-amber-400',
  ];
  
  // Map each job.id to a fixed color index on first load
  private colorMap = new Map<number, number>();

  constructor() {
    // effect() called directly inside constructor = valid injection context
    effect(() => {
      const jobs = this.hotJobs();
      if (jobs.length && !this.cards().length) {
        // Assign colors based on original order from API
        jobs.forEach((job, i) => {
          this.colorMap.set(job.id, i % this.colorPalette.length);
        });
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

  cardColorClass(job: HotJob): string {
    const colorIndex = this.colorMap.get(job.id) ?? 0;
    return this.colorPalette[colorIndex];
  }

  cardClass(index: number, job: HotJob): string {
    const base = `
      group relative  
      border rounded-xl p-4 cursor-grab active:cursor-grabbing
      transition-all duration-150 select-none
    `;
    const color = this.cardColorClass(job);
  
    if (this.isDragging(index)) {
      return base + color + ' opacity-40 scale-95';
    }
    if (this.isDragOver(index)) {
      return base + ' border-purple-500 bg-purple-50 scale-[1.03] shadow-md shadow-purple-200';
    }
    return base + color;
  }
  

  trackById(_: number, job: HotJob): number {
    return job.id;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: '2-digit'
    });
  }
  tagClass(job: HotJob): string {
    const tags = [
      'bg-violet-50 border-violet-200',
      'bg-sky-50 border-sky-200',
      'bg-emerald-50 border-emerald-200',
      'bg-amber-50 border-amber-200',
    ];
    const i = this.colorMap.get(job.id) ?? 0;
    return tags[i % tags.length];
  }
  // Call this in your save handler after the API responds
  resetCards(): void {
    this.colorMap.clear();
    this.cards.set([]);  // triggers effect to re-map colors from fresh hotJobs()
  }
}

