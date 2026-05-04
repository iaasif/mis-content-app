import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyNameSuggestion } from '../../services/company-name-suggestion';
import { CompanySuggestion } from '../../models/jobs.data';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { StoreDataService } from '../../services/store-data-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-mis-nav',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './mis-nav.html',
  styleUrl: './mis-nav.css',
})
export class MisNav {
  private readonly router = inject(Router);
  private readonly companyApi = inject(CompanyNameSuggestion);
  private readonly destroyRef = inject(DestroyRef);
  protected storeData = inject(StoreDataService);

  companyName = this.storeData.SELECTED_COMPANY ?? null;
  currentRoute = signal<string>(this.router.url);
  query = signal('');
  isFocused = signal(false);
  suggestions = signal<CompanySuggestion[]>([]);

  private readonly querySubject = new Subject<string>();

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentRoute.set(event.urlAfterRedirects);
        }
      });

    this.querySubject
      .pipe(
        map(value => value.trim()),
        debounceTime(150),
        distinctUntilChanged(),
        switchMap(query =>
          query
            ? this.companyApi.companyNamesSuggestions(query).pipe(
                map(list => list.slice(0, 8)),
                catchError(() => of([] as CompanySuggestion[]))
              )
            : of([] as CompanySuggestion[])
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(list => this.suggestions.set(list));
  }

  onQueryChange(value: string): void {
    this.query.set(value);

    if (!value.trim()) {
      this.suggestions.set([]);
    }

    this.querySubject.next(value);
  }

  selectCompany(data: CompanySuggestion): void {
    localStorage.setItem('SELECTED_COMPANY', JSON.stringify(data));
    this.storeData.SELECTED_COMPANY.set(data);
    this.query.set(data.companyName);
    this.isFocused.set(false);
    this.suggestions.set([]);
    this.querySubject.next('');
    console.log("data", data)
    console.log("selected company", this.storeData.SELECTED_COMPANY())
    console.log("this.suggestions", this.suggestions())

  }

  clearCompany(): void {
    localStorage.removeItem('SELECTED_COMPANY');
    this.storeData.SELECTED_COMPANY.set(null);
    this.query.set('');
    this.suggestions.set([]);
    this.querySubject.next('');
  }

  onFocus(): void {
    this.isFocused.set(true);
    const q = this.query().trim();
    if (q) {
      this.querySubject.next(q);
    }
  }

  onBlur(): void {
    setTimeout(() => this.isFocused.set(false), 120);
  }

}
