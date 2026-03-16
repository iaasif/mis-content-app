import { Component, inject, signal } from '@angular/core';
import { StoreDataService } from '../../services/store-data-service';
import { MisApi } from '../../services/mis-api';

@Component({
  selector: 'app-delete-company',
  imports: [],
  templateUrl: './delete-company.html',
  styleUrl: './delete-company.css',
})
export class DeleteCompany {
  private readonly misApi = inject(MisApi);
  storeData = inject(StoreDataService);
  companyData = this.storeData.SELECTED_COMPANY;

  deleteCompany(): void {
    if (this.companyData()) {
      this.misApi.deleteCompany(this.companyData()!.id).subscribe({
        next: (res) => {
          console.log('delete', res);
        },
        error: (err) => {
          console.log('dlt err', err);
        }
      })
    }

  }

}
