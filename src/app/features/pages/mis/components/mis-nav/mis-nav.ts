import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyNameSuggestion } from '../../services/company-name-suggestion';
import { CompanySuggestion } from '../../models/jobs.data';
import { tap } from 'rxjs';
import { StoreDataService } from '../../services/store-data-service';

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

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    const sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute.set(event.urlAfterRedirects);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onQueryChange(value: string): void {
    this.query.set(value);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    if (!value.trim()) {
      this.suggestions.set([]);
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.companyApi.companyNamesSuggestions(value.trim()).pipe(
        tap((res) => {
          console.log('API call for suggestions with query:', res);
        })
      ).subscribe({
        next: list => this.suggestions.set(list.slice(0, 8)),
        error: () => this.suggestions.set([]),
      });
    }, 150);
  }

  selectCompany(data: CompanySuggestion): void {
    localStorage.setItem('SELECTED_COMPANY', JSON.stringify(data));
    this.storeData.SELECTED_COMPANY.set(data);
    this.query.set(data.companyName);
    this.isFocused.set(false);
    this.suggestions.set([]);
    console.log("data", data)
    console.log("selected company", this.storeData.SELECTED_COMPANY())
    console.log("this.suggestions", this.suggestions())

  }

  clearCompany(): void {
    localStorage.removeItem('SELECTED_COMPANY');
    this.storeData.SELECTED_COMPANY.set({} as CompanySuggestion);
    this.query.set('');
    this.suggestions.set([]);
  }

  onFocus(): void {
    this.isFocused.set(true);
    const q = this.query().trim();
    if (q) {
      this.companyApi.companyNamesSuggestions(q).subscribe({
        next: list => this.suggestions.set(list.slice(0, 8)),
        error: () => this.suggestions.set([]),
      });
    }
  }

  onBlur(): void {
    setTimeout(() => this.isFocused.set(false), 120);
  }

}