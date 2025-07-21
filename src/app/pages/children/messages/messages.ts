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

@Component({
  selector: 'app-messages',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {
  chats = signal<any[]>([]);
  currentUser = signal<any>(null);

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
    if (this.chatForm.valid) {
      const messageContent = this.chatForm.value.message;
      const matchId = Number(
        this.route.snapshot.firstChild?.paramMap.get('matchId')
      );
      this.messageService
        .sendMessage(matchId, { contenuto: messageContent })
        .subscribe({
          next: (response) => {
            console.log('Message sent successfully: ' + response);
            this.chatForm.reset();
            this.getChats();
          },
          error: (error) => {
            console.error('Error sending message: ' + error);
          },
        });
    } else {
      alert('Assicurati di inserire un messaggio valido.');
    }
  }

  getChats() {
    this.matchService.getMatches().subscribe((data: any[]) => {
      this.chats.set(data);
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

  // Metodo per ottenere il profilo dell'altro utente nel match
  getOtherUserProfile(match: any) {
    const otherUserId =
      match.utente1Id === this.currentUser()?.id
        ? match.utente2Id
        : match.utente1Id;

    this.userService.getUserProfile(otherUserId).subscribe({
      next: (profile) => {
        match.otherUserProfile = profile;
        this.chats.update((chats) => [...chats]);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      },
    });
  }

  goToChat(matchId: number) {
    this.router.navigate(['/dashboard/messages/chat', matchId]).then(() => {});
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user) => {
      // setta l'utente corrente nel signal
      this.currentUser.set(user);
      // chiamata solo dopo aver ottenuto l'utente
      this.getChats();
    });
  }
}
