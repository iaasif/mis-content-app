import { Component, inject, linkedSignal, OnInit } from '@angular/core';
import { HotJobCard } from "../mis/components/hot-job-card/hot-job-card";
import { MisApi } from '../mis/services/mis-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { HotJob } from '../mis/models/jobs.data';
import { splitingJobTitles } from '../../../shared/utils/functions';

@Component({
  selector: 'app-hot-job-preview',
  imports: [HotJobCard],
  templateUrl: './hot-job-preview.html',
  styleUrl: './hot-job-preview.css',
})
export class HotJobPreview {
  private misService = inject(MisApi)


  protected hotJobs = toSignal(
    this.misService.getAllHotJobs().pipe(
      map(data =>
        data.map((job, i) => ({
          ...job,
          jobTitleList: splitingJobTitles(job.jobTitles),
          newSerial: i + 1 
        }))
      ),
      tap(res => console.log('res', res))
    ),
    { initialValue: [] }
  );

  

}
