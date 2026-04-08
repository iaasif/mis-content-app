import { Component, inject, linkedSignal, OnInit } from '@angular/core';
import { HotJobCard } from "../mis/components/hot-job-card/hot-job-card";
import { MisApi } from '../mis/services/mis-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { HotJob } from '../mis/models/jobs.data';

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
      map(data=>{
        return data.map(job => ({
          ...job,
          jobTitleList: this.splitingJobTitles(job.jobTitles)
        }));
       
      }),
      tap(
        res=>console.log("res",res)
      )
    ),
    { initialValue: [] }
  ) 
  
  private splitingJobTitles(jobTitle:string){
    return jobTitle.split('\r\n').map(title => title.trim());
  }

}
