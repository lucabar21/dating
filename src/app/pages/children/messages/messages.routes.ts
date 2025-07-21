import { Routes } from '@angular/router';

export const messagesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./messages').then((m) => m.Messages),
    children: [
      {
        path: 'chat/:matchId',
        loadComponent: () =>
          import('../../../components/chat/chat').then((m) => m.Chat),
      },
    ],
  },
];
