import { Component } from '@angular/core';

@Component({
  selector: 'app-hot-job-card',
  imports: [],
  templateUrl: './hot-job-card.html',
  styleUrl: './hot-job-card.css',
})
export class HotJobCard {
  job = {
    id: 1,
    company: 'Healthcare Diagnostic Center Limited',
    logo: 'assets/healthcare-logo.png',
    roles: [
      'Officer / Executive, Customer Care',
      'Executive / Senior Executive - Sales & Marketing'
    ],
    publishedAt: '2026-04-02',
    deadline: '2026-04-10'
  };
}
