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
        const latestChat = chats[0];
        // 🔥 NAVIGA CORRETTAMENTE DENTRO IL ROUTING MESSAGES
        this.router.navigate(['/dashboard/messages/chat', latestChat.id]);
      } else {
        // 🔥 CREA UN COMPONENT "NO CHATS" E NAVIGA LÌ
        this.router.navigate(['/dashboard/messages/no-chats']);
      }
    });
  }
}