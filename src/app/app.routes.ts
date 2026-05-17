import { Routes } from '@angular/router';
import { checkRefGuard } from './features/pages/mis/guards/check-ref-guard';
import { HotJobPreview } from './features/pages/hot-job-preview/hot-job-preview';
import { checkAuthCookieGuard } from './core/guards/check-auth-cookie-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/pages/mis/components/mis-home/mis-home').then(m => m.MisHome),
        title: 'Hotjob & Tender manager',
        canActivate: [checkAuthCookieGuard]

    },
    {
        path: 'new-hotjob',
        loadComponent: () => import('./features/pages/new-job/new-job').then(m => m.NewJob),
        title: 'New Hotjob'
    },
    {
        path: 'edit',
        loadComponent: () => import('./features/pages/edit-job/edit-job').then(m => m.EditJob),
        title: 'Edit Hotjob'

    },
    {
        path: 'up',
        loadComponent: () => import('./features/pages/mis/components/upload-file/upload-file').then(m => m.UploadFile),
        canActivate: [checkRefGuard],
        title: 'Upload File'
    },
    {
        path: 'rearrange-hotjobs',
        loadComponent: () => import('./features/pages/mis/components/rearrange-hot-job/rearrange-hot-job').then(m => m.RearrangeHotJob),
        title: 'Rearrange Hot Jobs'
    },
    {
        path: 'add-company',
        loadComponent: () => import('./features/pages/mis/components/add-company/add-company').then(m => m.AddCompany),
        title: 'Add Company'
    },
    {
        path: 'delete-company',
        loadComponent: () => import('./features/pages/mis/components/delete-company/delete-company').then(m => m.DeleteCompany),
        title: 'Delete Company'
    },
    {
        path: 'edit-company',
        loadComponent: () => import('./features/pages/edit-company/edit-company').then(m => m.EditCompany),
        title: 'Edit Company'
    },
    {
        path: 'hotJobPreview',
        loadComponent: () => import('./features/pages/hot-job-preview/hot-job-preview').then(m => HotJobPreview),
        title: 'Hot Job Preview'
    },
    {
        path: 'searchforedit',
        loadComponent: () => import('./features/pages/search-for-edit/search-for-edit').then(m => m.SearchForEdit),
        title: 'Search for Edit Hotjob'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/pages/login-layout/login-layout').then(m => m.LoginLayout),
        title: 'Login'
    }
];
