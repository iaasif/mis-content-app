import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { FilterFormControl } from '../../features/filters/interfaces/forms.interface';
import { ApplicantService } from '../../features/applicant/services/applicant.service';
import {
  ApplicantsResponse,
  FilterDataWithCount,
  FilterQueryObj,
} from '../../features/applicant/models/applicant.model';
import { LocalstorageService } from '../../core/services/essentials/localstorage.service';
import {
  CompanyIdLocalStorage,
  JobNoLocalStorage,
  OrderTypeEnums,
  PageType,
  SIdentity,
  SType,
} from '../enums/app.enums';
import { Pagination } from '../models/models';
import { HiringCountService } from './hiring-count.service';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  isQueryLoading = new Subject<boolean>();
  filterQuery$: Subject<FilterFormControl> = new Subject();
  filterQueryRes$: Observable<ApplicantsResponse | null> = of(null);

  private mainActiveTabs = new BehaviorSubject<SType>(SType.All);
  private mainActiveTabs$ = this.mainActiveTabs.asObservable();

  private sId = new BehaviorSubject<SIdentity>(SIdentity.All);
  private sId$ = this.sId.asObservable();

  private subTabsActiveTabs = new BehaviorSubject<PageType>(PageType.All);
  public subTabsActiveTabs$ = this.subTabsActiveTabs.asObservable();

  private sortVal = new BehaviorSubject<OrderTypeEnums>(
    OrderTypeEnums.Matching
  );
  private sortVal$ = this.sortVal.asObservable();

  private stepVal = new BehaviorSubject<string>('');
  private stepVal$ = this.stepVal.asObservable();

  private paginationObs = new BehaviorSubject<Pagination>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
  });
  private paginationObs$ = this.paginationObs.asObservable();

  private _pageType: string = '';
  private _sType: string = '';
  private _sIdentity: string = '';
  private _ordTyp: string = '';
  private _step: string = '';
  private _pagination!: Pagination;

  private hiringCountService = inject(HiringCountService);

  constructor(
    private applicantservice: ApplicantService,
    private localStorageService: LocalstorageService
  ) {
    this.getFilters();
  }

  private getFilters() {
    const allSrc$ = [
      this.filterQuery$.asObservable().pipe(startWith(null)),
      this.mainActiveTabs$.pipe(startWith(null)),
      this.subTabsActiveTabs$.pipe(startWith(null)),
      this.sId$.pipe(startWith(null)),
      this.stepVal$.pipe(startWith(null)),
      this.sortVal$.pipe(startWith(null)),
      this.paginationObs$.pipe(startWith(null)),
    ];
    this.filterQueryRes$ = combineLatest(allSrc$).pipe(
      debounceTime(500),
      switchMap((srcObs: any[]) =>
        this.getActivitiesCountWithFilterQuery(srcObs[0])
      ),
      map((filterWithCount: FilterDataWithCount) =>
        this.getActiveState(filterWithCount)
      ),
      switchMap((filterData: FilterQueryObj) =>
        this.applicantservice.getApplicantInformation(filterData)
      )
    );
  }

  private getActivitiesCountWithFilterQuery(
    filterData: FilterFormControl
  ): Observable<FilterDataWithCount> {
    return this.hiringCountService.getHiringActivityCountFromStore().pipe(
      filter((res) => !!res),
      map((res) => {
        return {
          hiringActivityCount: res,
          filterQuery: filterData,
        } as FilterDataWithCount;
      })
    );
  }

  private getActiveState(filterDataWithCount: FilterDataWithCount) {
    const query: FilterQueryObj = {
      pgtype: this._pageType,
      stype: this._sType,
      sIdentity: this._sIdentity,
      step: this._step,
      ordTyp: this._ordTyp,
      pageSize: this.pagination.pageSize,
      pageNo: this.pagination.pageNo,
      jobno: this.localStorageService.getItem(JobNoLocalStorage),
      CompanyId: this.localStorageService.getItem(CompanyIdLocalStorage),
      ...filterDataWithCount,
    };

    return query;
  }

  public triggerCountObsFromOutsideStore = () => this.hiringCountService.publishHiringActivityCountToListeners()

  public set pageType(v: string) {
    this._pageType = v ? v : '';
    this.subTabsActiveTabs.next(this.pageType as PageType);
  }

  public get pageType(): string {
    return this._pageType;
  }

  public set sType(v: string) {
    this._sType = v ? v : '';
    this.mainActiveTabs.next(this._sType as SType);
  }

  public get sType(): string {
    return this._sType;
  }

  public set sIdentity(v: string) {
    this._sIdentity = v ? v : '';
    this.sId.next(this._sIdentity as SIdentity);
  }

  public get sIdentity(): string {
    return this._sIdentity;
  }

  public set ordTyp(v: string) {
    this._ordTyp = v ? v : '';
    this.sortVal.next(this._ordTyp as OrderTypeEnums);
  }

  public get ordTyp(): string {
    return this._ordTyp;
  }

  public set step(v: string) {
    this._step = v ? v : '';
    this.stepVal.next(this._step);
  }

  public get step(): string {
    return this._step;
  }

  public set pagination(p: Pagination) {
    this._pagination = p;
    const pagination = {
      pageNo: this._pagination.pageNo,
      pageSize: this._pagination.pageSize,
    };
    this.paginationObs.next(pagination);
    this.isQueryLoading.next(true);
  }

  public get pagination(): Pagination {
    return this._pagination;
  }
}
