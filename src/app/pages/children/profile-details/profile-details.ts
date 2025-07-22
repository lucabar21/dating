import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserServ, UserData } from '../../../services/user-serv';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-details.html',
  styleUrl: './profile-details.css',
})
export class ProfileDetails implements OnInit {
  user: UserData | null = null;
  loading = false;
  error: string | null = null;

  @Input() userId: number | null = null;

  @Output() close = new EventEmitter<void>();

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
  };

  constructor(
    private route: ActivatedRoute,
    private userServ: UserServ,
    private location: Location
  ) {}

  ngOnInit(): void {
    //const userId = Number(this.route.snapshot.paramMap.get('id'));
    /*if (!isNaN(userId)) {
      this.loadUserProfile(userId);
    } else {
      this.error = 'ID utente non valido.';
      this.loading = false;
    }*/

    if (this.userId != null) {
      this.loadUserProfile(this.userId);
    } else {
      this.error = 'ID utente non valido.';
      this.loading = false;
    }
  }

  loadUserProfile(userId: number): void {
    this.loading = true;
    this.error = null;

    this.userServ.getUserProfile(userId).subscribe({
      next: (userData) => {
        this.user = userData;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento del profilo:', err);
        this.error = 'Impossibile caricare il profilo utente.';
        this.loading = false;
      },
    });
  }

  getInterestsArray(): string[] {
    if (!this.user?.interessi) return [];
    return this.user.interessi
      .split(',')
      .map((interest) => interest.trim())
      .filter((i) => i.length > 0);
  }

  getDisplayInterests(): string[] {
    return this.getInterestsArray().map((interest) => {
      const lower = interest.toLowerCase();
      return this.interestDisplayMap[lower] || `🔸 ${interest}`;
    });
  }

  getProfilePicture(): string {
    return (
      this.user?.fotoProfilo ||
      'https://via.placeholder.com/200x200?text=Foto+Profilo'
    );
  }

  goBack() {
    //this.location.back();
    this.close.emit();
  }
}
