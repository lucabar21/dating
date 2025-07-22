import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageServ } from '../../services/message-serv';
import { UserServ } from '../../services/user-serv';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, RouterModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
  messages = signal<any[]>([]);
  currentUser = signal<any>(null);
  private currentMatchId: number = 0;

  private route = inject(ActivatedRoute);
  private messageService = inject(MessageServ);
  private userService = inject(UserServ);

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  loadMessages(matchId: number) {
    this.messageService.getMessages(matchId).subscribe((data: any[]) => {
      this.messages.set(data);
      console.log('🔄 Messages loaded:', data.length);
    });
  }

  // 🔥 LISTENER PER RICARICARE I MESSAGGI
  private messageReloadListener = (event: any) => {
    const { matchId } = event.detail;
    if (matchId === this.currentMatchId) {
      console.log('🔄 Reloading messages for match:', matchId);
      this.loadMessages(matchId);
    }
  };

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const matchId = Number(params.get('matchId'));
      if (matchId) {
        this.currentMatchId = matchId;
        this.loadMessages(matchId);
      }
    });

    this.getCurrentUser();

    // 🔥 ASCOLTA L'EVENTO DI RELOAD
    window.addEventListener('reloadMessages', this.messageReloadListener);
  }

  ngOnDestroy() {
    // 🔥 RIMUOVI LISTENER QUANDO IL COMPONENTE VIENE DISTRUTTO
    window.removeEventListener('reloadMessages', this.messageReloadListener);
  }
}
