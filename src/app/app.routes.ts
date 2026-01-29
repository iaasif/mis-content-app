import { Routes } from '@angular/router';
import { MisHome } from './features/pages/mis/components/mis-home/mis-home';
import { NewJob } from './features/pages/new-job/new-job';


export const routes: Routes = [
    {
        path: '',
        component: MisHome,
    },
    {
        path: 'new',
        component: NewJob
    }
];
