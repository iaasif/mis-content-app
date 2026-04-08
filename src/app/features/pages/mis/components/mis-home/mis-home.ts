import { Hotjobs, Tenders } from './../../utils/mis.data';
import { Component } from '@angular/core';
import { HotJobsAndTender } from "../hot-jobs-and-tender/hot-jobs-and-tender";
import { HotJobCard } from "../hot-job-card/hot-job-card";

@Component({
  selector: 'app-mis-home',
  imports: [HotJobsAndTender, HotJobCard],
  templateUrl: './mis-home.html',
  styleUrl: './mis-home.css',
  standalone:true
})
export class MisHome {
  hotJobs = Hotjobs
  tenders = Tenders
}
