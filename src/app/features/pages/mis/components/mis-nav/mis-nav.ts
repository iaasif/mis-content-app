import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { COMPANY_NAME } from '../../utils/mis.data';

@Component({
  selector: 'app-mis-nav',
  imports: [RouterLink],
  templateUrl: './mis-nav.html',
  styleUrl: './mis-nav.css'
})
export class MisNav {
  companyName = COMPANY_NAME
}
