import { Routes } from '@angular/router';
import { MisHome } from './features/pages/mis/components/mis-home/mis-home';
import { NewJob } from './features/pages/new-job/new-job';
import { EditJob } from './features/pages/edit-job/edit-job';
import { UploadFile } from './features/pages/mis/components/upload-file/upload-file';
import { RearrangeHotJob } from './features/pages/mis/components/rearrange-hot-job/rearrange-hot-job';


export const routes: Routes = [
    {
        path: '',
        component: MisHome,
    },
    {
        path: 'new',
        component: NewJob
    },
    {
        path: 'edit',
        component: EditJob
    },
    {
        path: 'up',
        component: UploadFile
    },
    {
        path: 'rearrange',
        component: RearrangeHotJob
    },

];
