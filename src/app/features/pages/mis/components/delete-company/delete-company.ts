import { Component, inject, signal } from '@angular/core';
import { StoreDataService } from '../../services/store-data-service';
import { MisApi } from '../../services/mis-api';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-delete-company',
  imports: [],
  templateUrl: './delete-company.html',
  styleUrl: './delete-company.css',
})
export class DeleteCompany {
  private readonly misApi = inject(MisApi);
  private readonly hottoast = inject(HotToastService);
  storeData = inject(StoreDataService);

  companyData = this.storeData.SELECTED_COMPANY;

  showConfirm = signal(false);

  deleteCompany(): void {
    if (!this.companyData()) return;

    const loading = this.hottoast.loading('Deleting company...');
    this.showConfirm.set(false);

    this.misApi.deleteCompany(this.companyData()!.comId).subscribe({
      next: (res) => {
        console.log('delete', res);
        loading.close();
        this.hottoast.success('Company deleted successfully.');
        this.storeData.SELECTED_COMPANY.set(null);
      },
      error: (err) => {
        console.log('dlt err', err);
        loading.close();
        this.hottoast.error('Failed to delete. Please try again.');
      },
    });
  }
}