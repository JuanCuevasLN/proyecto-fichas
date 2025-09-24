import { Routes } from '@angular/router'
import { HomeComponent } from './home.component'

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                redirectTo: 'fichas',
                pathMatch: 'full'
            },
            {
                path: 'fichas',
                loadComponent: () => import('./fichas/fichas.component').then(c => c.FichasComponent)
            },
            {
                path: 'profiles',
                loadComponent: () => import('./profiles/profiles.component').then(c => c.ProfilesComponent)
            }
        ]
    }
]