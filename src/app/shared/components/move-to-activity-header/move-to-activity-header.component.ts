import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, model, input, signal, OnInit, AfterViewInit } from '@angular/core';
import { Applicant, MoveToActivityData } from '../../../features/applicant/models/applicant.model';
import { ActivityEnums, JobNoLocalStorage, MainTabsEnums, ResponseType } from '../../enums/app.enums';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, finalize, timer } from 'rxjs';
import { ApplicantCard, MoveToActivityResponse } from '../../../features/applicant/class/applicant-helper';
import { ToastrService } from 'ngx-toastr';
import { CircularLoaderService } from '../../../core/services/circularLoader/circular-loader.service';
import { LocalstorageService } from '../../../core/services/essentials/localstorage.service';
import { ApplicantCardService } from '../../../features/applicant/services/applicant-card.service';
import { HiringCountService } from '../../services/hiring-count.service';
import { QueryService } from '../../services/query.service';
import { JobInfoService } from '../../services/job-info.service';
import { IFrameLoaderComponent } from "../iFrame-loader/iFrame-loader.component";
import { VideoCVDetailsComponent } from '../../../features/applicant/video-cvdetails/video-cvdetails.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-move-to-activity-header',
  standalone: true,
  imports: [IFrameLoaderComponent, VideoCVDetailsComponent, NgClass],
  templateUrl: './move-to-activity-header.component.html',
  styleUrl: './move-to-activity-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoveToActivityHeaderComponent implements OnInit, AfterViewInit{
  isVideoAvailable = signal(true);
  applicant = model<Applicant>();
  isAlreadyShortListed = computed(()=> this.applicant()?.alreadyInActivities.includes(MainTabsEnums.Shortlist));
  isRestoreShow = computed(()=>this.applicant()?.isApplRej);
  modalTitle = model('');
  contentType = model<'video-cv-details' | 'cv-details'>('cv-details');
  readonly cvType = input('');
  readonly jobId = input(0);
  readonly applyId = input(0);
  readonly email = input('');
  readonly mobile = input('');
  readonly applicantName = input('');
  readonly photo = input('');
  readonly jobInfo = input('');
  readonly previewUrl = input('');

  cvDetails = '';

  private accplicantCardService = inject(ApplicantCardService);
  private destroyRef = inject(DestroyRef);
  private queryService = inject(QueryService);
  private localStorageService= inject(LocalstorageService);
  private loaderService = inject(CircularLoaderService);
  private hiringCountService = inject(HiringCountService);
  private toastrService = inject(ToastrService);
  private jobInfoService = inject(JobInfoService);

  ngOnInit() {
    this.cvDetails = ApplicantCard.getCVDetailsLink(this.applicant(),this.jobInfoService.getJobInfo()?.data.jobTitle,this.localStorageService.getItem(JobNoLocalStorage),this.queryService.sType,this.queryService.pageType);
  }

  ngAfterViewInit(): void {
    if (this.applicant() && !this.applicant()?.viewStatus) {
      timer(2000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.applicant.update(applicant => {
              return {
                ...applicant, 
                viewStatus: true
              } as Applicant
            });
            this.hiringCountService.setCount({
              viewStatus: true,
              movedActivity: MainTabsEnums.Viewed,
              activityData: {
                result: 0,
                message: '',
                levelStatus: 0,
                stepId: 0,
                name: '',
                type: '',
                dbActionResult: '',
                isMoved: false
              } // To be updated with the interface
            })
          }
        });
    }
  }

  onClickReject() {
    this.moveToActivity(ActivityEnums.Rejected, MainTabsEnums.Rejected);
  }

  onClickShortlist() {
    this.moveToActivity(ActivityEnums.Shortlist, MainTabsEnums.Shortlist);
  }
  onClickRestore() {
    this.moveToActivity(ActivityEnums.Restore, MainTabsEnums.Restore);
  }

  moveToActivity(ActivityTypeEnums: ActivityEnums, activityType: MainTabsEnums) {
    this.loaderService.setLoading(true);
    const rejected =
      activityType == MainTabsEnums.Rejected
        ? ApplicantCard.isRejected
        : ActivityTypeEnums === ActivityEnums.Shortlist ? 0 : ApplicantCard.isRestore
    const payload = ApplicantCard.genMoveToActivityPayload(
      activityType,
      this.localStorageService,
      this.queryService,
      ActivityTypeEnums,
      this.applicant()?.applyId as number
    );

    this.accplicantCardService
      .moveToActivity(payload, activityType)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((res) => Number(res.responseCode) === ResponseType.True),
        map(
          (res) =>
            ApplicantCard.getMoveToActivityResponse(
              res.data as MoveToActivityData
            ) as MoveToActivityResponse[]
        ),
        map((res) =>
          rejected
            ? {
                result: rejected == 1 ? 10 : 0,
                message:
                  rejected == 1
                    ? 'Applicant has been Rejected'
                    : 'Applicant has been Restored',
                levelStatus: rejected == 1 ? 10 : 0,
                stepId: rejected == 1 ? 10 : 0,
                name: rejected == 1 ? 'Rejected' : 'Restored',
                type: rejected == 1 ? 'Rejected' : 'al',
                dbActionResult: 'string',
                isMoved: true,
              }
            : res[0]
        ),
        finalize(() => this.loaderService.setLoading(false))
      )
      .subscribe({
        next: (data) => {
          this.hiringCountService.setCount({
            viewStatus: this.applicant()?.viewStatus,
            movedActivity: activityType,
            activityData: data,
            actionType:
              rejected === ApplicantCard.isRestore
                ? MainTabsEnums.Restore
                : MainTabsEnums.All,
          });
          this.updateApplicantActivities(activityType);
          this.toastrService.success("Successfully moved the applicant");
        }
      });
  }

  private updateApplicantActivities(activity: MainTabsEnums, ): void {
    this.applicant.update((prev) => {
      return {
        ...prev,
        isApplRej: activity === MainTabsEnums.Rejected ? true : false,
        alreadyInActivities:
          activity === MainTabsEnums.Restore
            ? prev?.alreadyInActivities.replace(MainTabsEnums.Rejected, '')
            : prev?.alreadyInActivities.concat(`, ${activity}`),
      } as Applicant;
    });
  }

  switchCvMode(switchToType: 'video-cv-details' | 'cv-details') {
    this.contentType.update(() => switchToType);
    this.modalTitle.update(() => switchToType === 'cv-details' ? "CV Details" : "Video CV Details");
  }
}
