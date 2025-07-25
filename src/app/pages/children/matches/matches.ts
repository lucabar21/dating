import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatchServ } from '../../../services/matchServ';
import { UserServ } from '../../../services/user-serv';
import { Spinner } from '../../../components/spinner/spinner';
import { ProfileDetails } from '../profile-details/profile-details';

@Component({
  selector: 'app-matches',
  imports: [CommonModule, RouterModule, Spinner, ProfileDetails],
  templateUrl: './matches.html',
  styleUrl: './matches.css',
})
export class Matches implements OnInit {
  // Stati per loading ed errori
  loading: boolean = false;

  private matchService = inject(MatchServ);
  private userService = inject(UserServ);
  private router = inject(Router);

  currentUser = signal<any>(null);
  matches = signal<any[]>([]);

  showProfileModal = false;
  selectedUserId: number | null = null;

  // Metodo per ottenere l'utente corrente e per settarlo nel signal currentUser
  getCurrentUser() {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  // Metodo per ottenere i match e per settarli nel signal matches
  getMatches() {
    this.loading = true;
    this.matchService.getMatches().subscribe((data: any[]) => {
      this.matches.set(data);
      data.forEach((match) => {
        this.getOtherUserProfile(match);
      });
      this.loading = false;
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
      match.isOtherUserActive = true; // 🔥 Utente attivo se riceve il profilo
      this.matches.update((matches) => [...matches]);
    },
    error: (error) => {
      console.error('Error loading profile:', error);

      // 🔥 GESTIONE UTENTE DISATTIVATO - RIMUOVI DALLA LISTA
      if (error.status === 400 || error.status === 404) {
        console.log('⚠️ Utente disattivato, rimuovo match dalla lista:', otherUserId);

        // 🔥 FILTRA VIA IL MATCH CON UTENTE DISATTIVATO
        this.matches.update((matches) =>
          matches.filter(m => m.id !== match.id)
        );
      }
    },
  });
}

  goToChat(matchId: number) {
    this.router.navigate(['/dashboard/messages/chat', matchId]).then(() => {});
  }

  // Metodo per convertire il timestamp del match in quanto tempo è passato da quando è stato creato
  timeAgo(timestamp: string): string {
    const now = new Date().getTime();
    const seconds = Math.floor((now - new Date(timestamp).getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} giorni fa`;
    } else if (hours > 0) {
      return `${hours} ore fa`;
    } else if (minutes > 0) {
      return `${minutes} minuti fa`;
    } else {
      return `${seconds} secondi fa`;
    }
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user) => {
      // setta l'utente corrente nel signal
      this.currentUser.set(user);
      // chiamata solo dopo aver ottenuto l'utente
      this.getMatches();
    });
  }

  openProfileModal(userId: number | null) {
    if (userId) {
      this.selectedUserId = userId;
      this.showProfileModal = true;
    }
  }

  closeProfileModal() {
    this.showProfileModal = false;
    this.selectedUserId = null;
  }
}
