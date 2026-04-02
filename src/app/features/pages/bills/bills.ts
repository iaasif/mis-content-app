import { Component } from '@angular/core';
interface BillRow {
  id: number;
  date: string;
  from: string;
  to: string;
  company: string;
  purpose: string;
  transport: string;
  amount: number;
}
@Component({
  selector: 'app-bills',
  imports: [],
  templateUrl: './bills.html',
  styleUrl: './bills.css',
})
export class Bills {

}
