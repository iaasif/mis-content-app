import { Login, Tenders } from './../../utils/mis-login.data';
import { Component } from '@angular/core';
import { HotJobsAndTender } from "../mis-login-parts/mis-login-parts";

@Component({
  selector: 'app-mis-home',
  imports: [HotJobsAndTender],
  templateUrl: './mis-login.html',
  styleUrl: './mis-login.css',
  standalone:true
})
export class MisLogin {
  hotJobs = Login
  tenders = Tenders
}
