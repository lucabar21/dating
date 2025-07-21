import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserServ } from '../../../services/user-serv';

// Interface per i dati utente dal backend
interface UserData {
  id: number;
  nome: string;
  bio: string;
  interessi: string; // Stringa separata da virgola dal backend
  fotoProfilo: string;
  citta: string;
  eta: number;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  // Dati utente dal backend
  user: UserData | null = null;

  // Stati per loading ed errori
  loading: boolean = true;
  error: string | null = null;

  // Mappa per il display degli interessi (stessa del Settings)
  interestDisplayMap: { [key: string]: string } = {
    sport: '⚽ Sport',
    calcio: '⚽ Calcio',
    musica: '🎵 Musica',
    viaggi: '✈️ Viaggi',
    cucina: '🍕 Cucina',
    lettura: '📚 Lettura',
    gaming: '🎮 Gaming',
    fotografia: '📸 Fotografia',
    cinema: '🎬 Cinema',
    yoga: '🧘 Yoga',
    vino: '🍷 Vino',
    palestra: '🏋️ Palestra',
    corsa: '🏃 Corsa',
    nuoto: '🏊 Nuoto',
    tennis: '🎾 Tennis',
    concerti: '🎤 Concerti',
    pittura: '🎨 Pittura',
    teatro: '🎭 Teatro',
    danza: '💃 Danza',
    tecnologia: '💻 Tecnologia',
    backpacking: '🎒 Backpacking',
    camping: '⛺ Camping',
    escursionismo: '🥾 Escursionismo',
    montagna: '🏔️ Montagna',
    // Aggiungi altri interessi che hai nel database
  };

  constructor(private userServ: UserServ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * Carica il profilo utente dal backend
   */
  loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    this.userServ.getCurrentUser().subscribe({
      next: (response: any) => {
        // console.log('✅ Profilo utente ricevuto:', response);
        this.user = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento profilo:', error);
        this.error = 'Errore nel caricamento del profilo. Riprova più tardi.';
        this.loading = false;
      },
    });
  }

  /**
   * Converte la stringa degli interessi in array per il display
   */
  getInterestsArray(): string[] {
    if (!this.user?.interessi) {
      return [];
    }

    // Splitta per virgola e pulisce gli spazi
    return this.user.interessi
      .split(',')
      .map((interest) => interest.trim())
      .filter((interest) => interest.length > 0);
  }

  /**
   * Converte gli interessi in formato display con icone
   */
  getDisplayInterests(): string[] {
    const interests = this.getInterestsArray();

    return interests.map((interest) => {
      const lowerInterest = interest.toLowerCase();
      // Usa la mappa per il display, altrimenti usa il valore originale
      return this.interestDisplayMap[lowerInterest] || `🔸 ${interest}`;
    });
  }

  /**
   * Gestisce il click di ricarica in caso di errore
   */
  retryLoad(): void {
    this.loadUserProfile();
  }

  /**
   * Getter per compatibilità con il template esistente
   */
  getName(): string {
    return this.user?.nome || 'Nome non disponibile';
  }

  getAge(): number {
    return this.user?.eta || 0;
  }

  getLocation(): string {
    return this.user?.citta || 'Località non disponibile';
  }

  getBio(): string {
    return this.user?.bio || 'Nessuna bio disponibile';
  }

  getProfilePicture(): any {
    return this.user?.fotoProfilo ||
    'https://via.placeholder.com/200x200?text=Foto+Profilo';
  }

  getInterests(): string[] {
    return this.getDisplayInterests();
  }

  // Metodo per debugging
  debugUserData(): void {
    console.log('🔍 User data:', this.user);
    console.log('🔍 Interests array:', this.getInterestsArray());
    console.log('🔍 Display interests:', this.getDisplayInterests());
  }
}
