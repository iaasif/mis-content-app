import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
  CompanyIdLocalStorage,
  JobNoLocalStorage,
  MainTabsEnums,
} from '../enums/app.enums';
import { BehaviorSubject, filter, map } from 'rxjs';
import { ApplicantService } from '../../features/applicant/services/applicant.service';
import { LocalstorageService } from '../../core/services/essentials/localstorage.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HiringActivityCount } from '../../features/applicant/models/applicant.model';
import { MoveToActivityResponse } from '../../features/applicant/class/applicant-helper';
import { DynamicActivity } from '../../features/job-title/models/job-information.model';
@Injectable({
  providedIn: 'root',
})
export class HiringCountService {
  private hiringActivityData = new BehaviorSubject<HiringActivityCount | null>(
    null
  );
  private hiringActivityData$ = this.hiringActivityData.asObservable();
  private activityCountData = signal<HiringActivityCount>(null!);

  private applicantsService = inject(ApplicantService);
  private localStorageService = inject(LocalstorageService);
  private destroyRef$ = inject(DestroyRef);

  constructor() {
    this.getHiringActivityCountFromServer();
  }

  private getHiringActivityCountFromServer() {
    const payload = {
      jobno: parseInt(this.localStorageService.getItem(JobNoLocalStorage)),
      CompanyId: this.localStorageService.getItem(CompanyIdLocalStorage),
    };
    this.applicantsService
      .getHiringActivitiesCount(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef$),
        filter((res) => res.Message.toLowerCase() === 'success')
      )
      .subscribe({
        next: (data) => {
          this.hiringActivityData.next(data);
          this.activityCountData.set(data);
        },
      });
  }

  public setCount(data: HiringCountData) {
    switch (data.movedActivity) {
      case MainTabsEnums.Reschedule:
        this.updateCountForReschedule();
        break;
      case MainTabsEnums.Shortlist:
        this.updateShortlistCount(data);
        break;
      case MainTabsEnums.Rejected:
      case MainTabsEnums.Restore:
        this.updateRejectedCount(data);
        break;
      case MainTabsEnums.HiringList:
        this.updateHiringListCount(data, false, true);
        break;
      case MainTabsEnums.Hired:
        this.updateHiringListCount(data, true);
        break;
      case MainTabsEnums.Remove:
        this.updateCountAfterRemove(data);
        break;
      case MainTabsEnums.AssignedActivity:
        this.updateAssignedCountInActivity(data);
        break;
      case MainTabsEnums.Viewed:
        this.updateViewedCount();
        break;
      default:
        this.updateActivityCount(data);
        break;
    }
  }

  private updateViewedCount() {
    this.activityCountData.update((prev) => {
      return {
        ...prev,
        StaticActivities: new Array({
          ...prev.StaticActivities[0],
          Viewed: prev.StaticActivities[0].Viewed + 1,
          NotViewed: prev.StaticActivities[0].NotViewed - 1,
        }),
      };
    });

    this.updateObserableCount();
  }

  private updateCountForReschedule() {
    this.activityCountData.update((prev) => prev);
    this.updateObserableCount();
  }

  private updateAssignedCountInActivity(data: HiringCountData) {
    if (
      this.activityCountData() &&
      this.activityCountData().DynamicActivities &&
      this.activityCountData().DynamicActivities.length
    ) {
      const activityToUpdate = this.findActivityToUpdate(data);
      const noOfApplicants =
        data.activityData.dbActionResult.split(', ').length;
      if (activityToUpdate) {
        activityToUpdate.ScheduledApplicantCount += noOfApplicants;
        activityToUpdate.NotScheduledApplicantCount -= noOfApplicants;
        this.activityCountData.update((prev) => {
          return {
            ...prev,
            DynamicActivities: prev.DynamicActivities.map((d) =>
              d.StepId === activityToUpdate.StepId ? activityToUpdate : d
            ),
          };
        });
      }
    }

    this.updateObserableCount();
  }

  private updateActivityCount(data: HiringCountData) {
    if (
      this.activityCountData() &&
      this.activityCountData().DynamicActivities
    ) {
      const activityToUpdate = this.findActivityToUpdate(data);
      if (activityToUpdate) {
        this.updateExistingActivity(activityToUpdate, data);
      } else {
        this.addNewActivity(data);
      }
      if (data.activityData.isShortListUpdate) {
        // update shortlist count when moving to activity when that applicant not into shortlist before
        this.activityCountData.update((prev) => {
          return {
            ...prev,
            TestTypewiseCount: prev.TestTypewiseCount.map((t) =>
              t.TestType.toLowerCase() === 'shortlist'
                ? { ...t, Applicants: t.Applicants + 1 }
                : t
            ),
          };
        });
      }
    }

    this.updateObserableCount();
  }

  private addNewActivity(data: HiringCountData) {
    const activityToAdd = {
      StepId: data.activityData.stepId,
      TestType: data.activityData.type,
      TestName: data.activityData.name,
      LevelStatus: data.activityData.levelStatus,
      TotalApplicantInStep: 1,
      ScheduledApplicantCount: 0,
      NotScheduledApplicantCount: 1,
      RejectedApplicantCount: 0,
    };
    this.activityCountData.update((prev) => {
      return {
        ...prev,
        DynamicActivities: [...prev.DynamicActivities, activityToAdd],
        TestTypewiseCount: prev.TestTypewiseCount.map((d) =>
          d.TestType === data.activityData.type
            ? { ...d, Applicants: d.Applicants + 1 }
            : d
        ),
      };
    });
  }

  private updateExistingActivity(
    existingActivityToUpdate: DynamicActivity,
    data: HiringCountData
  ) {
    existingActivityToUpdate.NotScheduledApplicantCount += 1;
    existingActivityToUpdate.TotalApplicantInStep += 1;
    this.activityCountData.update((prev) => {
      return {
        ...prev,
        DynamicActivities: prev.DynamicActivities.map((d) =>
          d.TestType === data.activityData.type &&
          d.LevelStatus === data.activityData.levelStatus
            ? existingActivityToUpdate
            : d
        ),
        TestTypewiseCount: prev.TestTypewiseCount.map((d) =>
          d.TestType === data.activityData.type
            ? { ...d, Applicants: d.Applicants + 1 }
            : d
        ),
      };
    });
  }

  private updateCountAfterRemove(data: HiringCountData) {
    if (
      this.activityCountData() &&
      this.activityCountData().StaticActivities &&
      this.activityCountData().StaticActivities.length
    ) {
      if (data.actionType === 'RemoveFromShortlist') {
        // Remove from Shortlist
        this.activityCountData.update((prev) => {
          return {
            ...prev,
            TestTypewiseCount: prev.TestTypewiseCount.map((d) =>
              d.TestType === 'shortlist'
                ? { ...d, Applicants: d.Applicants - 1 }
                : d
            ),
          };
        });
      } else if (data.actionType === 'NotAssigned') {
        // Remove from Not Assigned Card
        const existingActivityToUpdate = this.findActivityToUpdate(data);
        if (existingActivityToUpdate) {
          existingActivityToUpdate.NotScheduledApplicantCount -= 1;
          existingActivityToUpdate.TotalApplicantInStep -= 1;
          this.activityCountData.update((prev) => {
            return {
              ...prev,
              TestTypewiseCount: prev.TestTypewiseCount.map((d) =>
                d.TestType === existingActivityToUpdate.TestType
                  ? { ...d, Applicants: d.Applicants - 1 }
                  : d
              ),
              DynamicActivities: prev.DynamicActivities.map((d) =>
                d.StepId === existingActivityToUpdate.StepId
                  ? existingActivityToUpdate
                  : d
              ),
            };
          });
        }
      } else {
        // Remove from Final Hiring
        this.activityCountData.update((prev) => {
          return {
            ...prev,
            StaticActivities: new Array({
              ...prev.StaticActivities[0],
              FinalSelection:
                data.actionType === 'RemoveFromHL'
                  ? prev.StaticActivities[0].FinalSelection - 1
                  : prev.StaticActivities[0].FinalSelection,
              FinalHiring:
                data.actionType === 'RemoveFromHL'
                  ? prev.StaticActivities[0].FinalHiring - 1
                  : prev.StaticActivities[0].FinalHiring + 1,
              FinalHired:
                data.actionType === 'RemoveFromHired'
                  ? prev.StaticActivities[0].FinalHired - 1
                  : prev.StaticActivities[0].FinalHired,
            }),
          };
        });
      }
    }
    this.updateObserableCount();
  }

  private updateHiringListCount(
    data: HiringCountData,
    isHired?: boolean,
    isAlsoUpdateFS?: boolean
  ) {
    if (
      this.activityCountData() &&
      this.activityCountData().StaticActivities &&
      this.activityCountData().StaticActivities.length
    ) {
      this.activityCountData.update((prev) => {
        return {
          ...prev,
          StaticActivities: new Array({
            ...prev.StaticActivities[0],
            FinalSelection: isAlsoUpdateFS
              ? prev.StaticActivities[0].FinalSelection + 1
              : prev.StaticActivities[0].FinalSelection,
            FinalHiring: isHired
              ? prev.StaticActivities[0].FinalHiring - 1
              : prev.StaticActivities[0].FinalHiring + 1,
            FinalHired: isHired
              ? prev.StaticActivities[0].FinalHired + 1
              : prev.StaticActivities[0].FinalHired,
          }),
        };
      });
    }
    this.updateObserableCount();
  }

  private updateShortlistCount(data: HiringCountData) {
    const activityToUpdate = this.activityCountData().TestTypewiseCount.find(
      (t) => t.TestType.toLowerCase() === data.movedActivity.toLowerCase()
    );
    if (activityToUpdate) {
      const updated = {
        TestType: activityToUpdate.TestType,
        Applicants:
          activityToUpdate.Applicants +
          (data.activityData.noOfMoveTos ? data.activityData.noOfMoveTos : 1),
      };
      this.activityCountData.update((prev) => {
        return {
          ...prev,
          TestTypewiseCount: prev.TestTypewiseCount.map((t) =>
            t.TestType.toLowerCase() === updated.TestType.toLowerCase()
              ? updated
              : t
          ),
        };
      });
    }
    this.updateObserableCount();
  }

  private updateRejectedCount(data: HiringCountData) {
    if (
      this.activityCountData() &&
      this.activityCountData().StaticActivities &&
      this.activityCountData().StaticActivities.length
    ) {
      if (data.actionType === 'Assigned' || data.actionType === 'Restore') {
        const existingActivityToUpdate = this.findActivityToUpdate(data);
        if (existingActivityToUpdate) {
          if (data.actionType === 'Assigned') {
            // Reject from Activity Assigned Card
            existingActivityToUpdate.ScheduledApplicantCount -= 1;
            existingActivityToUpdate.RejectedApplicantCount += 1;
          } else {
            // Restore from Activity Reject Card
            existingActivityToUpdate.ScheduledApplicantCount += 1;
            existingActivityToUpdate.RejectedApplicantCount -= 1;
          }
          this.activityCountData.update((prev) => {
            return {
              ...prev,
              DynamicActivities: prev.DynamicActivities.map((d) =>
                d.StepId === existingActivityToUpdate.StepId
                  ? existingActivityToUpdate
                  : d
              ),
            };
          });
        } else {
          // Restore from All Rejected Cards/ Default rejected card
          this.activityCountData.update((prev) => {
            return {
              ...prev,
              StaticActivities: new Array({
                ...prev.StaticActivities[0],
                Rejected: prev.StaticActivities[0].Rejected - 1,
                All: prev.StaticActivities[0].All + 1,
                Viewed: data.viewStatus
                  ? prev.StaticActivities[0].Viewed + 1
                  : prev.StaticActivities[0].Viewed,
                NotViewed: data.viewStatus
                  ? prev.StaticActivities[0].NotViewed
                  : prev.StaticActivities[0].NotViewed + 1,
              }),
            };
          });
        }
      } else {
        // Reject
        this.activityCountData.update((prev) => {
          return {
            ...prev,
            StaticActivities: new Array({
              ...prev.StaticActivities[0],
              Rejected: prev.StaticActivities[0].Rejected + 1,
              All: prev.StaticActivities[0].All - 1,
              Viewed: data.viewStatus
                ? prev.StaticActivities[0].Viewed - 1
                : prev.StaticActivities[0].Viewed,
              NotViewed: data.viewStatus
                ? prev.StaticActivities[0].NotViewed
                : prev.StaticActivities[0].NotViewed - 1,
            }),
          };
        });
      }
    }

    this.updateObserableCount();
  }

  private findActivityToUpdate(
    data: HiringCountData
  ): DynamicActivity | undefined {
    return this.activityCountData().DynamicActivities.find(
      (d) =>
        d.TestType === data.activityData.type &&
        d.StepId === data.activityData.stepId
    );
  }

  public getHiringActivityCountFromStore() {
    return this.hiringActivityData$;
  }

  private updateObserableCount() {
    this.hiringActivityData.next(this.activityCountData());
  }

  public publishHiringActivityCountToListeners() {
    this.updateObserableCount();
  }
}

export interface HiringCountData {
  currentSType?: string;
  currentPageType?: string;
  movedActivity: MainTabsEnums;
  activityData: MoveToActivityResponse;
  viewStatus?: boolean;
  actionType?:
    | 'RemoveFromShortlist'
    | 'RemoveFromHL'
    | 'RemoveFromHired'
    | 'All'
    | 'Assigned'
    | 'NotAssigned'
    | 'Restore'
    | 'Rejected';
}
