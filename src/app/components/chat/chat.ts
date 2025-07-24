import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  ElementRef
} from '@angular/core';
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

  // 🔥 Flag per controllare quando fare lo scroll
  private isNewChatLoad: boolean = false;

  // 🔥 NUOVO: Signal per controllare visibilità chat
  chatVisible = signal<boolean>(true);

  @ViewChild('chatComponent') private scrollContainer!: ElementRef;

  private route = inject(ActivatedRoute);
  private messageService = inject(MessageServ);
  private userService = inject(UserServ);

  intervalId: any;

  // 🔥 METODO PER SCROLLARE IN BASSO - SCROLL ISTANTANEO
  scrollToBottom(): void {
    try {
      console.log('🔍 scrollToBottom chiamato, isNewChatLoad:', this.isNewChatLoad);
      const messagesContent = document.querySelector('.messages-content');
      console.log('🔍 messagesContent trovato:', !!messagesContent);

      if (messagesContent) {
        console.log('🔍 Before scroll - scrollTop:', messagesContent.scrollTop, 'scrollHeight:', messagesContent.scrollHeight);

        // 🔥 SCROLL ISTANTANEO SENZA ANIMAZIONE
        messagesContent.scrollTo({
          top: messagesContent.scrollHeight,
          behavior: 'auto' // 🔥 'auto' = istantaneo
        });

        console.log('✅ Scroll istantaneo eseguito verso il basso');
      }
    } catch (err) {
      console.log('Errore scroll:', err);
    }
  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  loadMessages(matchId: number) {
    // 🔥 NASCONDI LA CHAT DURANTE IL CARICAMENTO CAMBIO CHAT
    if (this.isNewChatLoad) {
      this.chatVisible.set(false);
      console.log('🔥 Chat nascosta durante cambio');
    }

    this.messageService.getMessages(matchId).subscribe((data: any[]) => {
      this.messages.set(data);
      console.log('🔄 Messages loaded:', data.length, 'isNewChatLoad:', this.isNewChatLoad);

      // 🔥 GESTIONE SCROLL E VISIBILITÀ
      if (this.isNewChatLoad) {
        // 🔥 SCROLL PRIMA DI MOSTRARE LA CHAT
        setTimeout(() => {
          this.scrollToBottom();
          this.isNewChatLoad = false;

          // 🔥 MOSTRA LA CHAT DOPO LO SCROLL
          setTimeout(() => {
            this.chatVisible.set(true);
            console.log('✅ Chat mostrata dopo scroll completo');
          }, 20); // Piccolo delay per essere sicuri

        }, 50);
      } else {
        // 🔥 REFRESH AUTOMATICO - MANTIENI SEMPRE VISIBILE
        this.chatVisible.set(true);
        console.log('📱 Refresh automatico - chat sempre visibile');
      }
    });
  }

  ngOnInit() {
    this.getCurrentUser();

    // 🔥 LOGICA DEL CAMBIO CHAT
    this.route.paramMap.subscribe((params) => {
      const matchId = Number(params.get('matchId'));
      console.log('🔍 Route param changed - matchId:', matchId, 'currentMatchId:', this.currentMatchId);

      if (matchId && matchId !== this.currentMatchId) {
        // 🔥 CAMBIO CHAT
        console.log('🔄 Cambio chat da', this.currentMatchId, 'a', matchId);
        this.currentMatchId = matchId;
        this.isNewChatLoad = true;
        this.loadMessages(matchId);
      } else if (matchId && this.currentMatchId === 0) {
        // 🔥 PRIMO CARICAMENTO
        console.log('🔄 Primo caricamento chat:', matchId);
        this.currentMatchId = matchId;
        this.isNewChatLoad = true;
        this.loadMessages(matchId);
      }
    });

    this.messageService.reloadChat$.subscribe((matchId) => {
      // 🔥 RELOAD MANUALE (quando invii messaggio) - ATTIVA SCROLL
      console.log('🔄 Reload manuale chat - ATTIVA SCROLL');
      this.isNewChatLoad = true;
      this.loadMessages(matchId);
    });

    this.intervalId = setInterval(() => {
      // 🔥 REFRESH AUTOMATICO - NON ATTIVA SCROLL
      console.log('🔄 Refresh automatico - mantengo posizione scroll');
      this.loadMessages(this.currentMatchId);
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
