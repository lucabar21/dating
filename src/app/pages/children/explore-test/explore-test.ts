import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserData, UserServ } from '../../../services/user-serv';
import { Swipe, SwipeData } from '../../../services/swipe';
import { ExploreCard } from '../../../components/explore-card/explore-card';

@Component({
  selector: 'app-explore-test',
  imports: [CommonModule, RouterModule, ExploreCard],
  templateUrl: './explore-test.html',
  styleUrl: './explore-test.css',
})
export class ExploreTest {
  // Variabile signal per memorizzare gli utenti da esplorare
  discoverableUsers = signal<UserData[]>([]);

  // Variabile signal per verificare se l'utente ha un account premium
  isPremium = signal(false);

  // Indice corrente per la visualizzazione dei profili
  currentIndex = 0;

  /* testUsers: UserData[] = [
    {
      id: 1,
      nome: 'Maria',
      bio: 'Biografia test',
      interessi: 'viaggi, animali',
      fotoProfilo: 'http://placedog.net/400',
      citta: 'Roma',
      eta: 25,
      accountType: 'STANDARD',
    },
    {
      id: 2,
      nome: 'Luca',
      bio: 'Biografia test',
      interessi: 'sport, musica',
      fotoProfilo: 'http://placedog.net/390',
      citta: 'Milano',
      eta: 30,
      accountType: 'STANDARD',
    },
    {
      id: 3,
      nome: 'Giulia',
      bio: 'Biografia test',
      interessi: 'arte, cinema',
      fotoProfilo: 'http://placedog.net/490',
      citta: 'Firenze',
      eta: 28,
      accountType: 'STANDARD',
    },
  ];
  ARRAY MOCKATO PER AVERE PIU' PROFILI E TESTARE IL CAMBIO CARD
  */

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
    return this.discoverableUsers()[this.currentIndex];
    // return this.testUsers[this.currentIndex]; TEST PER AVERE PIU' PROFILI
  }

  // Metodo che recupera gli utenti da esplorare
  getDiscoverableUsers() {
    this.userService.getDiscoverableUsers().subscribe({
      next: (users) => {
        this.discoverableUsers.set(Array.isArray(users) ? users : [users]);
      },
      error: (error) => {
        console.error('Errore nel recupero dei profili pertinenti:', error);
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
    // console.log('Swipe action:', data); PER TESTARE SENZA INVIO REALE AL BE

    this.nextCard();
  }

  // Metodo che gestisce il passaggio al profilo successivo
  nextCard() {
    if (this.currentIndex < this.discoverableUsers().length - 1) {
      this.currentIndex++;
      console.log('Nuovo currentIndex:', this.currentIndex);
    } else {
      alert('Non ci sono più profili per te!');
    }
    /* if (this.currentIndex < this.testUsers.length - 1) {
      this.currentIndex++;
      console.log('Nuovo currentIndex:', this.currentIndex);
    } else {
      alert('Non ci sono più profili per te!');
    }  TEST PER AVERE PIU' PROFILI */
  }

  ngOnInit() {
    this.getDiscoverableUsers();
    this.checkAccountType();
  }
}
