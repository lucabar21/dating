import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';

export const routes: Routes = [
  { path: '', component: Homepage },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then(
        (m) => m.dashboardRoutes
      ),
  },
];
