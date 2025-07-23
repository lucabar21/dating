import { Component } from '@angular/core';
import { MessageServ } from '../../services/message-serv';
import { Router } from '@angular/router';
import { MatchServ } from '../../services/matchServ';

@Component({
  selector: 'app-redirect-to-latest-chat',
  imports: [],
  templateUrl: './redirect-to-latest-chat.html',
  styleUrl: './redirect-to-latest-chat.css',
})
export class RedirectToLatestChat {
  constructor(private chatService: MatchServ, private router: Router) {
    this.redirectToChat();
  }

  redirectToChat() {
    this.chatService.getMatches().subscribe((chats: any[]) => {
      if (chats && chats.length > 0) {
        const latestChat = chats[0]; // oppure scegli come vuoi (ultima attiva, ordinata, ecc.)
        this.router.navigate(['chat', latestChat.id]);
      } else {
        // Nessuna chat, mostra un componente vuoto o un messaggio
        this.router.navigate(['/no-chats']);
      }
    });
  }
}
