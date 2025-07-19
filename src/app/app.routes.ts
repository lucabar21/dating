import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { adminGuard } from './auth/admin-guard';
import { ResetPassword } from './pages/reset-password/reset-password';

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
    path: 'confirm',
    loadComponent: () =>
      import('./components/confirm/confirm').then((m) => m.Confirm),
  },
  {
  path: 'reset-password',
  component: ResetPassword,
  title: 'Reset Password - Lovvami'
},
  {
    path: 'dashboard',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then(
        (m) => m.dashboardRoutes
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
