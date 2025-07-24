import { inject } from '@angular/core';
import { Router, type CanActivateFn, UrlTree } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { MatchServ } from '../services/matchServ';

export const latestChatGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const chatService = inject(MatchServ);
  const router = inject(Router);

  return chatService.getMatches().pipe(
    map((chats: any[]) => {
      if (chats && chats.length > 0) {
        const latestChat = chats[0];
        return router.createUrlTree(['dashboard/messages/chat', latestChat.id]);
      } else {
        return router.createUrlTree(['dashboard/messages/no-chats']);
      }
    }),
    catchError((error) => {
      console.error('Errore nel caricamento delle chat:', error);
      return of(router.createUrlTree(['dashboard/messages/no-chats']));
    })
  );
};
