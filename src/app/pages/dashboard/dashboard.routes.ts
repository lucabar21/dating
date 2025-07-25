import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('../children/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../children/settings/settings').then((m) => m.Settings),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('../children/messages/messages.routes').then(
            (m) => m.messagesRoutes
          ),
      },
      {
        path: 'matches',
        loadComponent: () =>
          import('../children/matches/matches').then((m) => m.Matches),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('../children/explore-test/explore-test').then(
            (m) => m.ExploreTest
          ),
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
];
