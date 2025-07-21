import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-explore-card',
  imports: [CommonModule],
  templateUrl: './explore-card.html',
  styleUrl: './explore-card.css',
})
export class ExploreCard {
  // Variabile Input che riceve l'utente da visualizzare
  @Input() discoverableUser: any;

  // Variabile Input che indica se l'utente è abilitato al SUPER_LIKE
  @Input() canSuperLike: boolean = false;

  // Variabile Output che emette l'evento di swipe
  @Output() swipeEvent = new EventEmitter<'LIKE' | 'PASS' | 'SUPER_LIKE'>();

  // Riferimento all'elemento card per gestire gli eventi touch
  @ViewChild('card') cardRef!: ElementRef;

  // Variabili per gestire il movimento del touch
  private startX = 0;
  private startY = 0;
  private deltaX = 0;
  private deltaY = 0;

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

  getDisplayInterests(): string[] {
    if (!this.discoverableUser?.interessi) return [];

    return this.discoverableUser.interessi
      .split(',')
      .map((interest: string) => interest.trim())
      .filter((i: string) => i.length > 0)
      .map((interest: string) => {
        const lower = interest.toLowerCase();
        return this.interestDisplayMap[lower] || `🔸 ${interest}`;
      });
  }

  // Metodo che gestisce gli eventi touch per lo swipe all'inizializzazione del componente
  ngAfterViewInit(): void {
    // Costante che racchiude l'elemento card
    const card = this.cardRef.nativeElement;

    card.addEventListener('touchstart', (e: TouchEvent) => {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    });

    card.addEventListener('touchmove', (e: TouchEvent) => {
      this.deltaX = e.touches[0].clientX - this.startX;
      this.deltaY = e.touches[0].clientY - this.startY;

      card.style.transform = `translate(${this.deltaX}px, ${
        this.deltaY
      }px) rotate(${this.deltaX / 10}deg)`;
    });

    card.addEventListener('touchend', () => {
      const threshold = 100;
      let tipo: 'LIKE' | 'PASS' | 'SUPER_LIKE' | null = null;

      if (Math.abs(this.deltaX) > Math.abs(this.deltaY)) {
        if (this.deltaX > threshold) tipo = 'PASS'; // right
        else if (this.deltaX < -threshold) tipo = 'LIKE'; // left
      } else {
        if (this.deltaY < -threshold) tipo = 'SUPER_LIKE'; // up
      }

      // reset
      card.style.transform = '';
      this.deltaX = 0;
      this.deltaY = 0;

      // Emette l'evento di swipe se il tipo è definito e gestisce il caso del SUPER_LIKE
      if (tipo === 'SUPER_LIKE' && !this.canSuperLike) {
        alert('Il Super Like è disponibile solo per account Premium!');
      } else if (tipo) {
        this.swipeEvent.emit(tipo);
      }
    });
  }

  // Metodo che emette l'evento di swipe con il tipo specificato
  emitSwipe(tipo: 'LIKE' | 'PASS' | 'SUPER_LIKE') {
    this.swipeEvent.emit(tipo);
  }
}
