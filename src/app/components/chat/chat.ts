import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
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

  //
  private previousMessageCount: number = 0;
  newMessageCount = signal(0);
  showScrollButton = signal(false);
  private lastReadMessageCount = 0;

  @ViewChild('chatComponent') private scrollContainer!: ElementRef;

  private route = inject(ActivatedRoute);
  private messageService = inject(MessageServ);
  private userService = inject(UserServ);

  intervalId: any;

  // 🔥 METODO PER SCROLLARE IN BASSO - SCROLL ISTANTANEO
  scrollToBottom(): void {
    try {
      console.log(
        '🔍 scrollToBottom chiamato, isNewChatLoad:',
        this.isNewChatLoad
      );
      const messagesContent = document.querySelector('.messages-content');
      console.log('🔍 messagesContent trovato:', !!messagesContent);

      if (messagesContent) {
        console.log(
          '🔍 Before scroll - scrollTop:',
          messagesContent.scrollTop,
          'scrollHeight:',
          messagesContent.scrollHeight
        );

        // 🔥 SCROLL ISTANTANEO SENZA ANIMAZIONE
        messagesContent.scrollTo({
          top: messagesContent.scrollHeight,
          behavior: 'auto', // 🔥 'auto' = istantaneo
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
    this.messageService.getMessages(matchId).subscribe((data: any[]) => {
      const totalMessages = data.length;
      const wasAtBottom = this.isUserAtBottom();

      this.messages.set(data);

      if (this.isNewChatLoad) {
        setTimeout(() => {
          this.scrollToBottom();
          this.isNewChatLoad = false;
          this.newMessageCount.set(0);
          this.lastReadMessageCount = totalMessages; // ✅ reset known read count
          this.showScrollButton.set(false);
          this.chatVisible.set(true);
        }, 50);
      } else {
        if (wasAtBottom) {
          this.scrollToBottom();
          this.lastReadMessageCount = totalMessages; // ✅ user read all messages
          this.newMessageCount.set(0);
          this.showScrollButton.set(false);
        } else {
          const unread = totalMessages - this.lastReadMessageCount;
          this.newMessageCount.set(unread);
          this.showScrollButton.set(true);
          console.log(
            '🆕 Total:',
            totalMessages,
            'Last Read:',
            this.lastReadMessageCount,
            'Unread:',
            unread
          );
        }
      }
    });
  }

  private isUserNearBottom(): boolean {
    const el = document.querySelector('.messages-content');
    if (!el) return true;

    const threshold = 150; // px from bottom
    const position = el.scrollTop + el.clientHeight;
    const height = el.scrollHeight;

    return height - position < threshold;
  }

  isUserAtBottom(): boolean {
    const container = document.querySelector('.messages-content');
    if (!container) return true;

    const threshold = 100; // pixels from bottom to still consider "at bottom"
    const position = container.scrollTop + container.clientHeight;
    const height = container.scrollHeight;

    return height - position < threshold;
  }

  ngOnInit() {
    this.getCurrentUser();

    // 🔥 LOGICA DEL CAMBIO CHAT
    this.route.paramMap.subscribe((params) => {
      const matchId = Number(params.get('matchId'));
      console.log(
        '🔍 Route param changed - matchId:',
        matchId,
        'currentMatchId:',
        this.currentMatchId
      );

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

    setTimeout(() => {
      const container = document.querySelector('.messages-content');
      if (container) {
        container.addEventListener('scroll', () => {
          if (this.isUserAtBottom()) {
            this.showScrollButton.set(false);
            this.newMessageCount.set(0);
          }
        });
      }
    }, 100); // wait DOM to render
  }

  ngAfterViewInit() {
    const container = document.querySelector('.messages-content');
    if (container) {
      container.addEventListener('scroll', () => {
        const threshold = 40;
        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

        if (isAtBottom) {
          this.newMessageCount.set(0);
          this.lastReadMessageCount = this.messages().length;
          this.showScrollButton.set(false);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
