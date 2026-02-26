import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMPANY_NAME } from '../../utils/mis.data';

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
  companyName = COMPANY_NAME;         // what you show in UI (selected)
  companies = companyList;            // source list

  query = '';                         // what user types
  filteredCompanies: Company[] = [];  // suggestions
  showDropdown = false;

  onQueryChange(value: string) {
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

  selectCompany(c: Company) {
    this.companyName = c.name;
    this.query = c.name;
    this.filteredCompanies = [];
    this.showDropdown = false;
  }

  hideDropdownSoon() {
    setTimeout(() => (this.showDropdown = false), 120);
  }
}