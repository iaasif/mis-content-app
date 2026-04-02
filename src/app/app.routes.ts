import { Routes } from '@angular/router';






import { checkRefGuard } from './features/pages/mis/guards/check-ref-guard';


export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/pages/mis/components/mis-home/mis-home').then(m => m.MisHome),
    },
    {
        path: 'new',
        loadComponent: () => import('./features/pages/new-job/new-job').then(m => m.NewJob)
    },
    {
        path: 'edit',
        loadComponent: () => import('./features/pages/edit-job/edit-job').then(m => m.EditJob)
    },
    {
        path: 'up',
        loadComponent: () => import('./features/pages/mis/components/upload-file/upload-file').then(m => m.UploadFile),
        canActivate: [checkRefGuard]
    },
    {
        path: 'rearrange',
        loadComponent: () => import('./features/pages/mis/components/rearrange-hot-job/rearrange-hot-job').then(m => m.RearrangeHotJob)
    },
    {
        path: 'add-company',
        loadComponent: () => import('./features/pages/mis/components/add-company/add-company').then(m => m.AddCompany)
    },
    {
        path: 'delete',
        loadComponent: () => import('./features/pages/mis/components/delete-company/delete-company').then(m => m.DeleteCompany)
    },

];
