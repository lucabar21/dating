import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserData, UserServ } from '../../../services/user-serv';
import { Swipe, SwipeData } from '../../../services/swipe';
import { ExploreCard } from '../../../components/explore-card/explore-card';
import { PlaceholderCard } from '../../../components/placeholder-card/placeholder-card';
import { Spinner } from '../../../components/spinner/spinner';
import { ProfileDetails } from '../profile-details/profile-details';

@Component({
  selector: 'app-explore-test',
  imports: [
    CommonModule,
    RouterModule,
    ExploreCard,
    PlaceholderCard,
    Spinner,
    ProfileDetails,
  ],
  templateUrl: './explore-test.html',
  styleUrl: './explore-test.css',
})
export class ExploreTest {
  // Variabile signal per memorizzare gli utenti da esplorare
  discoverableUsers = signal<UserData[]>([]);

  // Variabile signal per verificare se l'utente ha un account premium
  isPremium = signal(false);

  // Variabile signal per gestire lo stato di loading
  loading = signal(true);

  // Indice corrente per la visualizzazione dei profili
  currentIndex = 0;

  // Variabili per la visualizzazione del profilo
  showProfileModal = false;

  private userService = inject(UserServ);
  private swipeService = inject(Swipe);

  // Metodo che controlla se l'utente ha un account premium
  checkAccountType() {
    const accountType = localStorage.getItem('account_type');

    if (
      accountType === 'GOLD' ||
      accountType === 'PLATINUM' ||
      accountType === 'PREMIUM'
    ) {
      this.isPremium.set(true);
    }
  }

  // Metodo che restituisce l'utente corrente da visualizzare
  get CurrentUser() {
    const users = this.discoverableUsers();
    return users.length > 0 && this.currentIndex < users.length
      ? users[this.currentIndex]
      : null;
  }

  // Metodo che verifica se ci sono ancora utenti da mostrare
  get hasMoreUsers() {
    const users = this.discoverableUsers();
    return users.length > 0 && this.currentIndex < users.length;
  }

  // Metodo che verifica se mostrare il placeholder
  get shouldShowPlaceholder() {
    return (
      !this.loading() &&
      (!this.hasMoreUsers || this.discoverableUsers().length === 0)
    );
  }

  // Metodo che recupera gli utenti da esplorare
  getDiscoverableUsers() {
    this.loading.set(true);

    this.userService.getDiscoverableUsers().subscribe({
      next: (users) => {
        console.log('✅ UTENTI EXPLORE RICEVUTI:', users);
        this.discoverableUsers.set(Array.isArray(users) ? users : [users]);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Errore nel recupero dei profili pertinenti:', error);
        this.discoverableUsers.set([]);
        this.loading.set(false);
      },
    });
  }

  // Metodo che gestisce l'azione di swipe
  handleSwipe(tipo: string, target: number) {
    const data: SwipeData = {
      utenteTargetId: target,
      tipo: tipo as 'LIKE' | 'PASS' | 'SUPER_LIKE',
    };

    this.swipeService.makeSwipe(data);
    this.nextCard();
  }

  // Metodo che gestisce il passaggio al profilo successivo
  nextCard() {
    if (this.currentIndex < this.discoverableUsers().length - 1) {
      this.currentIndex++;
      console.log('Nuovo currentIndex:', this.currentIndex);
    } else {
      // Non ci sono più profili - il template mostrerà automaticamente il placeholder
      console.log('Fine profili raggiunti');
      this.currentIndex++;
    }
  }

  openProfileModal($event: any) {
    console.log("Apro il profilo per l'utente:");
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  ngOnInit() {
    this.getDiscoverableUsers();
    this.checkAccountType();
  }
}
