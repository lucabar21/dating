import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MatchServ } from '../../../services/matchServ';
import { MessageServ } from '../../../services/message-serv';
import { UserServ } from '../../../services/user-serv';
import { Chat } from '../../../components/chat/chat';
import { Spinner } from '../../../components/spinner/spinner';

@Component({
  selector: 'app-messages',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    RouterOutlet,
    Spinner,
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {
  loading: boolean = false;
  chats = signal<any[]>([]);
  currentUser = signal<any>(null);
  activeChatId: number | null = null;

  // 🔥 NUOVO: Signal per tracciare lo stato dell'altro utente
  currentOtherUser = signal<any>(null);
  isOtherUserDeactivated = signal<boolean>(false);

  private userService = inject(UserServ);
  private matchService = inject(MatchServ);
  private messageService = inject(MessageServ);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  chatForm = new FormGroup({
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(500),
    ]),
  });

  sendMessage() {
    // 🔥 CONTROLLO SE L'ALTRO UTENTE È DISATTIVATO
    if (this.isOtherUserDeactivated()) {
      alert(
        '❌ Non puoi inviare messaggi a questo utente perché non è più disponibile.'
      );
      return;
    }

    if (this.chatForm.valid) {
      const messageContent = this.chatForm.value.message;
      const matchId = Number(
        this.route.snapshot.firstChild?.paramMap.get('matchId')
      );

      console.log('🔥 DEBUG: Sending message to matchId:', matchId);
      console.log('🔥 DEBUG: Message content:', messageContent);

      this.messageService
        .sendMessage(matchId, { contenuto: messageContent })
        .subscribe({
          next: (response) => {
            console.log('✅ Messaggio inviato con successo:', response);
            this.chatForm.reset();
          },
          error: (error) => {
            console.error("Errore durante l'invio del messaggio:", error);

            // 🔥 GESTIONE ERRORE UTENTE DISATTIVATO
            if (
              error.status === 400 &&
              error.error?.includes('non è più disponibile')
            ) {
              alert('❌ Questo utente non è più disponibile.');
              this.isOtherUserDeactivated.set(true);
              return;
            }

            if (error.status === 0 || error.status === 200) {
              console.log('🔄 Ricaricamento dei messaggi...');
              this.chatForm.reset();
              this.reloadCurrentChat(matchId);
            }
          },
        });
    } else {
      alert('Assicurati di inserire un messaggio valido.');
    }
  }

  private reloadCurrentChat(matchId: number) {
    this.messageService.emitReload(matchId);
  }

  // 🔥 METODO MODIFICATO - Fix caricamento
  getChats() {
    this.loading = true;
    this.matchService.getMatches().subscribe((data: any[]) => {
      // 🔥 INIZIALIZZA LE CHAT CON PLACEHOLDER "NORMALI"
      const chatsWithDefaults = data.map((chat) => ({
        ...chat,
        otherUserProfile: {
          nome: 'Caricamento...',
          fotoProfilo: 'http://placedog.net/350', // Avatar di default
          isLoading: true,
        },
        isOtherUserActive: true, // 🔥 ASSUME SEMPRE ATTIVO INIZIALMENTE
        profileLoaded: false,
      }));

      this.chats.set(chatsWithDefaults);
      this.loading = false; // 🔥 NASCONDI SPINNER PRINCIPALE

      // 🔥 CARICA I PROFILI REALI IN BACKGROUND
      data.forEach((chat) => {
        this.getOtherUserProfile(chat);
      });
    });
  }

  // Metodo per ottenere l'utente corrente e per settarlo nel signal currentUser
  getCurrentUser() {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  // 🔥 METODO AGGIORNATO per gestire utenti disattivati
  getOtherUserProfile(match: any) {
    const otherUserId =
      match.utente1Id === this.currentUser()?.id
        ? match.utente2Id
        : match.utente1Id;

    this.userService.getUserProfile(otherUserId).subscribe({
      next: (profile) => {
        // 🔥 AGGIORNA IL MATCH SPECIFICO CON PROFILO REALE
        this.chats.update((chats) =>
          chats.map((chat) =>
            chat.id === match.id
              ? {
                  ...chat,
                  otherUserProfile: {
                    ...profile,
                    isLoading: false,
                  },
                  isOtherUserActive: true,
                  profileLoaded: true,
                }
              : chat
          )
        );

        // 🔥 AGGIORNA STATO DELL'ALTRO UTENTE SE È LA CHAT CORRENTE
        this.updateCurrentOtherUserStatus(match);
      },
      error: (error) => {
        console.error('Error loading profile:', error);

        // 🔥 GESTIONE ERRORE UTENTE DISATTIVATO
        if (error.status === 400 || error.status === 404) {
          console.log('⚠️ Utente probabilmente disattivato:', otherUserId);

          // 🔥 AGGIORNA COME DISATTIVATO
          this.chats.update((chats) =>
            chats.map((chat) =>
              chat.id === match.id
                ? {
                    ...chat,
                    otherUserProfile: {
                      id: otherUserId,
                      fotoProfilo: 'assets/images/user-deactivated.png',
                      isDeactivated: true,
                      isLoading: false,
                    },
                    isOtherUserActive: false, // 🔥 ORA DIVENTA DISATTIVATO
                    profileLoaded: true,
                  }
                : chat
            )
          );

          // 🔥 AGGIORNA STATO DELL'ALTRO UTENTE SE È LA CHAT CORRENTE
          this.updateCurrentOtherUserStatus(match);
        }
      },
    });
  }

  // 🔥 NUOVO: Metodo per aggiornare lo stato dell'altro utente nella chat corrente
  private updateCurrentOtherUserStatus(match: any) {
    const currentMatchId = Number(
      this.route.snapshot.firstChild?.paramMap.get('matchId')
    );

    if (currentMatchId === match.id) {
      const currentMatch = this.chats().find((chat) => chat.id === match.id);
      if (currentMatch) {
        this.currentOtherUser.set(currentMatch.otherUserProfile);
        this.isOtherUserDeactivated.set(!currentMatch.isOtherUserActive);

        console.log('🔍 Current other user status updated:', {
          matchId: currentMatchId,
          otherUser: currentMatch.otherUserProfile?.nome,
          isActive: currentMatch.isOtherUserActive,
        });
      }
    }
  }

  goToChat(matchId: number) {
    this.activeChatId = matchId;
    this.router.navigate(['/dashboard/messages/chat', matchId]).then(() => {
      // 🔥 AGGIORNA STATO DELL'ALTRO UTENTE QUANDO CAMBIA CHAT
      const currentMatch = this.chats().find((chat) => chat.id === matchId);
      if (currentMatch) {
        this.updateCurrentOtherUserStatus(currentMatch);
      }
    });
  }

  // 🔥 METODO AGGIORNATO per ottenere il display name dell'altro utente
  getOtherUserDisplayName(chat: any): string {
    // Se è disattivato, mostra nome speciale
    if (chat.otherUserProfile?.isDeactivated) {
      return 'Utente disattivato';
    }
    // Altrimenti mostra il nome normale
    return chat.otherUserProfile?.nome || 'Caricamento...';
  }

  // 🔥 METODO AGGIORNATO per ottenere la classe CSS per la chat
  getChatClass(chat: any): string {
    // Se è disattivato, classe disattivata
    if (!chat.isOtherUserActive) {
      return 'user-card deactivated';
    }
    // Altrimenti classe normale
    return 'user-card';
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user) => {
      // setta l'utente corrente nel signal
      this.currentUser.set(user);
      // chiamata solo dopo aver ottenuto l'utente
      this.getChats();
    });

    // 🔥 ASCOLTA CAMBI DI ROTTA PER AGGIORNARE STATO ALTRO UTENTE
    this.route.firstChild?.paramMap.subscribe((params) => {
      const matchId = Number(params.get('matchId'));
      this.activeChatId = matchId;
      if (matchId) {
        const currentMatch = this.chats().find((chat) => chat.id === matchId);
        if (currentMatch) {
          this.updateCurrentOtherUserStatus(currentMatch);
        }
      }
    });
  }
}
