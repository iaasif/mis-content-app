import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMPANY_NAME } from '../../utils/mis.data';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Company = { id: number; name: string };

const companyList: Company[] = [
  { id: 1, name: "company 1" },
  { id: 2, name: "company 2" },
  { id: 3, name: "company 3" },
  { id: 4, name: "company 4" },
  { id: 5, name: "company 5" },
  { id: 6, name: "company 6" },
  { id: 7, name: "company 7" },
  { id: 8, name: "company 8" },
  { id: 9, name: "company 9" },
  { id: 10, name: "company 10" },
];

@Component({
  selector: 'app-mis-nav',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './mis-nav.html',
  styleUrl: './mis-nav.css',
})
export class MisNav {
  router = inject(Router)
  companyName = signal(COMPANY_NAME());        
  companies = companyList; 

  currentRoute = signal<string>('')
  query = '';
  filteredCompanies: Company[] = [];
  showDropdown = false;

  constructor(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe((event: NavigationEnd) => {
      console.log('New URL:', event.urlAfterRedirects);
      this.currentRoute.set(event.urlAfterRedirects);
    });
  }

  onQueryChange(value: string):void {
    this.query = value;

    const q = value.trim().toLowerCase();
    if (!q) {
      this.filteredCompanies = [];
      this.showDropdown = false;
      return;
    }

    this.filteredCompanies = this.companies
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 8);

    this.showDropdown = this.filteredCompanies.length > 0;
  }

  selectCompany(c: Company):void {
    this.companyName.set(c.name); 

    localStorage.setItem('COMPANY_NAME', c.name);
    this.query = c.name;
    this.filteredCompanies = [];
    this.showDropdown = false;  
  }

  hideDropdownSoon():void {
    setTimeout(() => (this.showDropdown = false), 120);
  }


}