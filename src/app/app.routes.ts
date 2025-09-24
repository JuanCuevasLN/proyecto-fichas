import { Routes } from '@angular/router';
import { authGuard } from './system/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.routes').then(r => r.routes),
        canMatch: [authGuard],
    },
    {
        path: '',
        loadChildren: () => import('./system/sign.routes').then(r => r.routes)
    }
];
