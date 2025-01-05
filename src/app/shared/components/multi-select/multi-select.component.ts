import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MultiSelectQueryEvent, SelectItem } from '../../models/models';
import { FormControl, FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  takeUntil,
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent implements OnInit, OnChanges, OnDestroy {
  @Input() searchLabel: string = '';
  @Input() suggestions: SelectItem[] = [];
  @Input() isFullWidth: boolean = false;
  @Input() overLayVisibleOnlyOnFocus: boolean = false;
  @Input() overLayVisibleOnlyOnSuggestions: boolean = false;
  @Input() dbncTime: number = 300;
  @Input() multiplSelection: boolean = true;
  @Input() maxSelection: number = 0;
  @Input() resetOnSelection: boolean = false;
  @Input() checkBoxVisible: boolean = true;
  @Input() control: FormControl<SelectItem[]> = new FormControl();
  @Input() isSearchBox: boolean = true;
  @Input() isSourceChanged: boolean = false;

  @Output() searchQuery: EventEmitter<MultiSelectQueryEvent> =
    new EventEmitter<MultiSelectQueryEvent>();
  @Output() onSelect: EventEmitter<SelectItem[]> =
    new EventEmitter<SelectItem[]>();

  searchQueryInput = signal<string>('');
  isOverLayVisible = signal(false);

  isDestroyed$: Subject<boolean> = new Subject();

  @ViewChild('parentDivRef') parentDivRef: ElementRef | null = null;

  constructor() {
    const inputStream$ = toObservable(this.searchQueryInput);

    inputStream$
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.dbncTime),
        map((query) => query.trim()),
        // filter((str) => str.trim().length !== 0),
        takeUntil(this.isDestroyed$)
      )
      .subscribe({
        next: (query) => { this.searchQuery.emit({ query }) },
      });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['suggestions']?.currentValue) {
      if (!changes?.['suggestions'].isFirstChange()) {
        this.showOverLay();
      }
    }
    if (changes?.['suggestions']?.currentValue && this.isSourceChanged === true) {
      this.control.setValue([]);
    }
  }

  ngOnInit(): void {
    this.showOverLay();
  }

  showOverLay() {
    if (this.getOverLayVisibleOnlyOnSuggestions() && !this.suggestions?.length && !this.searchQueryInput().trim()) {
      this.setIsOverLayVisible(false);
      return;
    }

    if (this.isOverLayVisible() || this.getOverLayVisibleOnlyOnFocus()) {
      return;
    }

    this.setIsOverLayVisible(true);
  }

  // use only when overLayVisibleOnlyOnFocus = true
  hideOverLay() {
    this.setIsOverLayVisible(false);
  }

  setIsOverLayVisible(value: boolean) {
    this.isOverLayVisible.set(value);
  }

  onSearchInputFocus() {
    if (this.isOverLayVisible()) {
      return;
    }

    if (this.isSuggestionsAvailable(this.suggestions)) {
      this.setIsOverLayVisible(true);
    }
  }

  onSearchInputBlur() { }

  isSuggestionsAvailable(suggestions: SelectItem[]): boolean {
    return !!suggestions?.length;
  }

  getOverLayVisibleOnlyOnFocus(): boolean {
    return this.overLayVisibleOnlyOnFocus;
  }

  getOverLayVisibleOnlyOnSuggestions(): boolean {
    return this.overLayVisibleOnlyOnSuggestions;
  }

  // use only when overLayVisibleOnlyOnFocus = true
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.getOverLayVisibleOnlyOnFocus()) {
      return;
    }
    const source = event.target;

    if (
      this.parentDivRef?.nativeElement &&
      !this.parentDivRef.nativeElement.contains(source)
    ) {
      this.hideOverLay();
    }
  }

  toggleSelection(item: SelectItem) {
    item.isSelected = !item.isSelected;
    const selectedItems: SelectItem[] = [...(this.control?.value || [])];
    if (item.isSelected) {
      if (this.maxSelection && selectedItems.length === this.maxSelection) {
        item.isSelected = false;
        return;
      }
      selectedItems.push(item);
    } else {
      const itemIndex = selectedItems.findIndex(selectedItem => selectedItem.value === item.value);
      if (itemIndex > -1) {
        selectedItems.splice(itemIndex, 1);
      }
    }

    if (this.control) {
      this.control.setValue(selectedItems);
    }

    if (!this.multiplSelection && this.resetOnSelection) {
      this.searchQueryInput.set("");
      this.suggestions = [];
    }

    this.onSelect.emit(selectedItems);
  }

  // TODO: following not working, make it work later
  handleKeypress(event: KeyboardEvent, item: any) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action to avoid scrolling
      this.toggleSelection(item);
    }
  }
}