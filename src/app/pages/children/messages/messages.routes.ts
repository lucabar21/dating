import { Routes } from '@angular/router';
import { latestChatGuard } from '../../../guards/latest-chat-guard-guard';

export const messagesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./messages').then((m) => m.Messages),
    children: [
      {
        path: '',
        canActivate: [latestChatGuard],
        loadComponent: () =>
          import('../../../components/chat/chat').then((m) => m.Chat),
      },
      {
        path: 'chat/:matchId',
        loadComponent: () =>
          import('../../../components/chat/chat').then((m) => m.Chat),
      },
      {
        path: 'no-chats',
        loadComponent: () =>
          import('../../../components/no-chats/no-chats').then(
            (m) => m.NoChats
          ),
      },
    ],
  },
];
