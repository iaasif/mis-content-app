import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, inject, OnInit, Output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarService } from './services/navbar.service';
import { LocalstorageService } from '../../services/essentials/localstorage.service';
import { CompanyIdLocalStorage, CompanyLogoUrl, CompanyName, IsAdminUser, UserId } from '../../../shared/enums/app.enums';
import { CreditSystem, cvSearchService, JobPostingService, NavResponse, SalesPersonData } from './class/navbarResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent implements OnInit {
  @Output() navbarDataLoaded = new EventEmitter<SalesPersonData>();

  creditSystem: CreditSystem = {} as CreditSystem;
  cvSearchService: cvSearchService = {} as cvSearchService;
  jobPostingService: JobPostingService = {} as JobPostingService;
  currentDate: string= '';
  cvBankPercentage: number = 0;
  navData: any;
  smsPercent=0;

  loadingCreditSystem = signal(true);  
  loadingCvSearchService = signal(true); 
  loadingJobPostingService = signal(true);
  
  navbarService= inject(NavbarService);
  localStorageService= inject(LocalstorageService);
  
  remainingBasicJobs=0;
  maxBasicJobs=0;
  remainingStandoutJobs=0;
  remainingStandoutPremiumJobs=0;
  maxStandoutJobs=0;
  maxStandoutPremiumJobs=0;
  jobPostingAccessPercentage: number=0;
  companyName: string = window.localStorage.getItem(CompanyName) || '';
  companyLogoURL: string = window.localStorage.getItem(CompanyLogoUrl) || 'images/default-company.png';
  isAdminUser: boolean = window.localStorage.getItem(IsAdminUser) === 'true';

  ngOnInit(): void {
    this.getNavbar();
    this.currentDate = new Date().toString();
  }


  getNavbar() {
    const companyId = this.localStorageService.getItem(CompanyIdLocalStorage);
    const userId = this.localStorageService.getItem(UserId);
    this.navbarService.getNavbarData({ companyId, userId }).subscribe({
      next: (res: NavResponse) => {
         this.navbarDataLoaded.emit(res.data as SalesPersonData);
        this.navData = res.data;
        this.smsPercent = Math.ceil((this.navData.smsRemaining *100)/ this.navData.smsPurchased);
        this.smsPercent = this.smsPercent < 0 ? 0 : this.smsPercent;

        this.creditSystem = (res.data.creditSystem ?? {}) as CreditSystem;
        this.cvSearchService = (res.data.cvSearchService ?? {}) as cvSearchService;
        this.jobPostingService = (res.data.jobPostingService ??{}) as JobPostingService;

        this.loadingCreditSystem.set(this.isObjectEmpty(this.creditSystem));
        this.loadingCvSearchService.set(this.isObjectEmpty(this.cvSearchService));
        this.loadingJobPostingService.set(this.isObjectEmpty(this.jobPostingService));

        this.cvBankPercentage = Math.floor((this.cvSearchService.available*100) / this.cvSearchService.limit);
        this.jobPostingAssessShow();
      },
      error: (err) => {
      console.error(err);
      }
    });
  }

  isObjectEmpty(obj: any): boolean {
    return obj === null || obj === undefined || (typeof obj === 'object' && Object.keys(obj).length === 0);
  }  

  jobPostingAssessShow() {

      this.remainingBasicJobs =
        this.jobPostingService?.basicListLimit ?? 0;

      this.maxBasicJobs = this.jobPostingService?.maxJob ?? 0;

      this.remainingStandoutJobs =
        this.jobPostingService?.standoutLimit ?? 0;
      this.maxStandoutJobs =
        this.jobPostingService?.maxStandout ?? 0;

      this.remainingStandoutPremiumJobs =
        this.jobPostingService?.standoutPremiumLimit ?? 0;

      this.maxStandoutPremiumJobs =
        this.jobPostingService?.maxStandoutPremium ?? 0;

      const remainingJobsSum =
        this.remainingBasicJobs +
        this.remainingStandoutJobs +
        this.remainingStandoutPremiumJobs;
        
      const maxJobsSum =
        this.maxBasicJobs + this.maxStandoutJobs + this.maxStandoutPremiumJobs;

      if (maxJobsSum > 0) {
        this.jobPostingAccessPercentage = Math.round(
          (remainingJobsSum / maxJobsSum) * 100
        );
      }
    }
  }
  

