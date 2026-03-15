import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMPANY_NAME } from '../../utils/mis.data';
import { CompanyNameSuggestion } from '../../services/company-name-suggestion';
import { CompanySuggestion } from '../../models/jobs.data';

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

  companyName = COMPANY_NAME;
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
      this.companyApi.companyNamesSuggestions(value.trim()).subscribe({
        next: list => this.suggestions.set(list.slice(0, 8)),
        error: () => this.suggestions.set([]),
      });
    }, 150);
  }

  selectCompany(name: string): void {
    localStorage.setItem('COMPANY_NAME', name);
    COMPANY_NAME.set(name);
    this.query.set(name);
    this.isFocused.set(false);
    this.suggestions.set([]);
  }

  clearCompany(): void {
    localStorage.removeItem('COMPANY_NAME');
    COMPANY_NAME.set('');
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