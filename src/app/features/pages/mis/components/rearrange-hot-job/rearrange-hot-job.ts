import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { MisApi } from '../../services/mis-api';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { HotJob } from '../../models/jobs.data';
import { map, tap } from 'rxjs';
import { splitingJobTitles } from '../../../../../shared/utils/functions';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-rearrange-hot-job',
  standalone: true,
  imports: [],
  templateUrl: './rearrange-hot-job.html',
  styleUrl: './rearrange-hot-job.css',
})
export class RearrangeHotJob {
  private misService = inject(MisApi);
  private destroyRef = inject(DestroyRef);
  private hotToasterService = inject(HotToastService)

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
    ),
    { initialValue: [] as HotJob[] }
  );

  private readonly colorPalette = [
    'border-violet-200 bg-violet-100 hover:border-violet-400',
    'border-sky-200 bg-sky-100 hover:border-sky-400',
    'border-emerald-200 bg-emerald-100 hover:border-emerald-400',
    'border-amber-200 bg-amber-100 hover:border-amber-400',
  ];

  private readonly tagPalette = [
    'bg-violet-50 border-violet-200',
    'bg-sky-50 border-sky-200',
    'bg-emerald-50 border-emerald-200',
    'bg-amber-50 border-amber-200',
  ];

  private colorMap = new Map<number, number>();

  constructor() {
    effect(() => {
      const jobs = this.hotJobs();
      if (jobs.length && !this.cards().length) {
        jobs.forEach((job, i) => {
          this.colorMap.set(job.id, i % this.colorPalette.length);
        });
        this.cards.set([...jobs]);
      }
    });
  }

  // ── Computed signals (replace all template methods) ──────────────────────

  /** Array of card CSS classes, one entry per card, indexed by position. */
  cardClasses = computed<string[]>(() => {
    const sourceIdx = this.dragSourceIndex();
    const overIdx = this.dragOverIndex();
    const base = `
      group relative
      border rounded-xl p-4 cursor-grab active:cursor-grabbing
      transition-all duration-150 select-none
    `;
    return this.cards().map((job, index) => {
      const color = this.colorPalette[this.colorMap.get(job.id) ?? 0];
      if (index === sourceIdx) return base + color + ' opacity-40 scale-95';
      if (index === overIdx)   return base + ' border-purple-500 bg-purple-50 scale-[1.03] shadow-md shadow-purple-200';
      return base + color;
    });
  });

  /** Array of tag CSS classes, one entry per card, keyed by same position. */
  tagClasses = computed<string[]>(() =>
    this.cards().map(job =>
      this.tagPalette[(this.colorMap.get(job.id) ?? 0) % this.tagPalette.length]
    )
  );

  /**
   * Array of { posted, ends } formatted date strings, one per card.
   * formatDate() was called twice per card on every change-detection cycle.
   * Now it runs once when cards() changes.
   */
  formattedDates = computed<{ posted: string; ends: string }[]>(() =>
    this.cards().map(job => ({
      posted: new Date(job.postedOn).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: '2-digit',
      }),
      ends: new Date(job.endDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: '2-digit',
      }),
    }))
  );

  // ── Drag handlers ─────────────────────────────────────────────────────────

  onDragStart(index: number): void { this.dragSourceIndex.set(index); }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    this.dragOverIndex.set(index);
  }

  onDragLeave(): void  { this.dragOverIndex.set(null); }
  onDragEnd(): void    { this.dragSourceIndex.set(null); this.dragOverIndex.set(null); }

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

  private swapCards(sourceIndex: number, targetIndex: number): void {
    const updated = [...this.cards()];
    [updated[sourceIndex], updated[targetIndex]] = [updated[targetIndex], updated[sourceIndex]];
     // keep newSerial in sync with position
    updated.forEach((card, i) => card.newSerial = i + 1);

    this.cards.set(updated);
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  trackById(_: number, job: HotJob): number { return job.id; }

  resetCards(): void {
    this.colorMap.clear();
    this.cards.set([]);
  }

  updateCards(): void {
    const payload = this.cards().map((card, index) => ({
      nam: card.companyName,
      id: card.id,
      serialNo: index + 1
    }));

    console.log(payload);

    this.misService
      .reOrderHotJobs(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log('Reordered successfully', res);
          this.hotToasterService.success('Rearrange Successful')
          window.location.reload();
        },
        error: (err) => {
          console.error('Reorder failed', err);
          this.hotToasterService.success('Rearrange Failed.Refresh this page and try again')
        }
      });
  }
}