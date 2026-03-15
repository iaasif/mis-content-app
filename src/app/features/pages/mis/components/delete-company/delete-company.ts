import { Component, signal } from '@angular/core';
import { COMPANY_NAME } from '../../utils/mis.data';

@Component({
  selector: 'app-delete-company',
  imports: [],
  templateUrl: './delete-company.html',
  styleUrl: './delete-company.css',
})
export class DeleteCompany {
  companyName = COMPANY_NAME

}
