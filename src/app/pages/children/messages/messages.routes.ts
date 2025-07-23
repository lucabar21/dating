import { Routes } from '@angular/router';

export const messagesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./messages').then((m) => m.Messages),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            '../../../components/redirect-to-latest-chat/redirect-to-latest-chat'
          ).then((m) => m.RedirectToLatestChat),
      },
      {
        path: 'chat/:matchId',
        loadComponent: () =>
          import('../../../components/chat/chat').then((m) => m.Chat),
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // fallback alla route con redirect dinamico
];
