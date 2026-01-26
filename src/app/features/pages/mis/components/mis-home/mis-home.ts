import { Hotjobs, Tenders } from './../../utils/mis.data';
import { Component } from '@angular/core';
import { HotJobsAndTender } from "../hot-jobs-and-tender/hot-jobs-and-tender";
import { MisNav } from "../mis-nav/mis-nav";

@Component({
  selector: 'app-mis-home',
  imports: [HotJobsAndTender, MisNav],
  templateUrl: './mis-home.html',
  styleUrl: './mis-home.scss',
  standalone:true
})
export class MisHome {
  hotJobs = Hotjobs
  tenders = Tenders
}
