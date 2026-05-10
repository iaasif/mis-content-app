import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, switchMap, tap } from 'rxjs';
import { CompanyNameSuggestion } from '../../../features/pages/mis/services/company-name-suggestion';
import { CompanySuggestion } from '../../../features/pages/mis/models/jobs.data';
import { MisApi } from '../../../features/pages/mis/services/mis-api';

@Component({
  selector: 'app-search-anything',
  imports: [ReactiveFormsModule],
  templateUrl: './search-anything.html',
  styleUrl: './search-anything.css',
})
export class SearchAnything {
  private companyNameService = inject(CompanyNameSuggestion);
  private misApi = inject(MisApi);
  
  isLoadingCompanies = signal(false);
  companyId = signal(0);
  companies = computed(() => this.companySuggestState().suggestions);
  
  searchCompanyQuery = new FormControl('');


  onCompanyInput(): void {
    if (this.companyId() !== 0) {
      this.companyId.set(0);
    }
  }

  shouldShowList = computed(() => {
    const { query } = this.companySuggestState();
    return (this.companyId() === 0 && query.length >= 1) || this.isLoadingCompanies();
  });

  private companySuggestState = toSignal(
    this.searchCompanyQuery.valueChanges.pipe(
      map((value) => value?.trim() ?? ''),
      debounceTime(300),
      distinctUntilChanged(),
      tap((query) => {
        if (query.length >= 2) this.isLoadingCompanies.set(true);
      }),
      switchMap((query) =>
        query.length >= 2
          ? this.companyNameService.companyNamesSuggestions(query).pipe(
            map((suggestions) => {
              this.isLoadingCompanies.set(false);
              return { query, suggestions };
            }),
            catchError(() => of({ query, suggestions: [] as CompanySuggestion[] })),
            finalize(() => this.isLoadingCompanies.set(false))
          )
          : of({ query, suggestions: [] as CompanySuggestion[] }).pipe(
            finalize(() => this.isLoadingCompanies.set(false))
          )
      )
    ),
    { initialValue: { query: '', suggestions: [] as CompanySuggestion[] } }
  );

  selectCompany(company: CompanySuggestion): void {
    console.log('selectCompany', company);
    this.searchCompanyQuery.setValue(company.companyName, { emitEvent: false });
    this.isLoadingCompanies.set(false);
    this.companyId.set(company.comId);

    this.misApi.getCompanyById(company.comId).subscribe({
      next: (res) => {
        console.log('getCompanyById', res);
        
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }


}
