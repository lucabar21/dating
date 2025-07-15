import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeServ } from '../../../services/theme-serv';

interface UserProfile {
  nome: string;
  username: string;
  bio: string;
  notificheAttive: boolean;
}

interface Preferences {
  generePreferito: 'MASCHIO' | 'FEMMINA' | null;
  minEta: number;
  maxEta: number;
  distanzaMax: number;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface EditingFields {
  nome: boolean;
  username: boolean;
  bio: boolean;
}

interface Interest {
  key: string;
  label: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings implements OnInit {

  selectedTab: string = 'account';

  @ViewChild('interestsModal') interestsModal!: ElementRef;
  @ViewChild('passwordModal') passwordModal!: ElementRef;

  // Variabili per tema
  isDarkTheme: boolean = false;

  // Profilo utente
  userProfile: UserProfile = {
    nome: 'Alex Rossi',
    username: 'alex.rossi@example.com',
    bio: 'Amo viaggiare e scoprire nuove culture...',
    notificheAttive: true
  };

  // Preferenze di matching
  preferences: Preferences = {
    generePreferito: 'FEMMINA',
    minEta: 22,
    maxEta: 35,
    distanzaMax: 25
  };

  // Dati per cambio password
  passwordData: PasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Stato editing dei campi
  editingFields: EditingFields = {
    nome: false,
    username: false,
    bio: false
  };

  // Backup values per cancel edit
  private backupValues: any = {};

  // Interessi selezionati
  selectedInterests: string[] = ['sport', 'musica', 'viaggi', 'cucina', 'lettura'];

  // Termine di ricerca per filtro interessi
  searchTerm: string = '';

  // Mappa degli interessi per display
  interestDisplayMap: { [key: string]: string } = {
    'sport': '⚽ Sport',
    'musica': '🎵 Musica',
    'viaggi': '✈️ Viaggi',
    'cucina': '🍕 Cucina',
    'lettura': '📚 Lettura',
    'gaming': '🎮 Gaming',
    'fotografia': '📸 Fotografia',
    'cinema': '🎬 Cinema',
    'yoga': '🧘 Yoga',
    'vino': '🍷 Vino',
    'palestra': '🏋️ Palestra',
    'corsa': '🏃 Corsa',
    'nuoto': '🏊 Nuoto',
    'tennis': '🎾 Tennis',
    'concerti': '🎤 Concerti',
    'pittura': '🎨 Pittura',
    'teatro': '🎭 Teatro',
    'danza': '💃 Danza',
    'backpacking': '🎒 Backpacking',
    'camping': '⛺ Camping',
    'escursionismo': '🥾 Escursionismo',
    'montagna': '🏔️ Montagna'
  };

  // Categorie di interessi
  interestCategories = {
    sport: [
      { key: 'sport', label: '⚽ Calcio' },
      { key: 'palestra', label: '🏋️ Palestra' },
      { key: 'corsa', label: '🏃 Corsa' },
      { key: 'nuoto', label: '🏊 Nuoto' },
      { key: 'tennis', label: '🎾 Tennis' },
      { key: 'basket', label: '🏀 Basket' },
      { key: 'yoga', label: '🧘 Yoga' },
      { key: 'ciclismo', label: '🚴 Ciclismo' },
      { key: 'arrampicata', label: '🧗 Arrampicata' },
      { key: 'sci', label: '⛷️ Sci' }
    ],
    arte: [
      { key: 'musica', label: '🎵 Musica' },
      { key: 'concerti', label: '🎤 Concerti' },
      { key: 'pittura', label: '🎨 Pittura' },
      { key: 'fotografia', label: '📸 Fotografia' },
      { key: 'teatro', label: '🎭 Teatro' },
      { key: 'danza', label: '💃 Danza' },
      { key: 'disegno', label: '✏️ Disegno' },
      { key: 'scultura', label: '🗿 Scultura' }
    ],
    viaggi: [
      { key: 'viaggi', label: '✈️ Viaggi' },
      { key: 'backpacking', label: '🎒 Backpacking' },
      { key: 'camping', label: '⛺ Camping' },
      { key: 'escursionismo', label: '🥾 Escursionismo' },
      { key: 'roadtrip', label: '🚗 Road Trip' },
      { key: 'spiaggia', label: '🏖️ Spiaggia' },
      { key: 'montagna', label: '🏔️ Montagna' },
      { key: 'culture', label: '🏛️ Culture' }
    ],
    cibo: [
      { key: 'cucina', label: '🍕 Cucina' },
      { key: 'vino', label: '🍷 Vino' },
      { key: 'birra', label: '🍺 Birra' },
      { key: 'caffè', label: '☕ Caffè' },
      { key: 'ristoranti', label: '🍽️ Ristoranti' },
      { key: 'dolci', label: '🧁 Dolci' },
      { key: 'street-food', label: '🌮 Street Food' },
      { key: 'vegano', label: '🥗 Vegano' }
    ],
    tech: [
      { key: 'gaming', label: '🎮 Gaming' },
      { key: 'programmazione', label: '💻 Programmazione' },
      { key: 'tech', label: '📱 Tecnologia' },
      { key: 'ai', label: '🤖 AI' },
      { key: 'crypto', label: '₿ Crypto' },
      { key: 'gadget', label: '⌚ Gadget' },
      { key: 'esports', label: '🏆 E-Sports' }
    ],
    cultura: [
      { key: 'lettura', label: '📚 Lettura' },
      { key: 'cinema', label: '🎬 Cinema' },
      { key: 'serie-tv', label: '📺 Serie TV' },
      { key: 'podcast', label: '🎧 Podcast' },
      { key: 'fumetti', label: '📖 Fumetti' },
      { key: 'poesia', label: '📝 Poesia' },
      { key: 'documentari', label: '🎥 Documentari' }
    ],
    natura: [
      { key: 'cani', label: '🐕 Cani' },
      { key: 'gatti', label: '🐱 Gatti' },
      { key: 'animali', label: '🦋 Animali' },
      { key: 'giardinaggio', label: '🌱 Giardinaggio' },
      { key: 'ecologia', label: '🌍 Ecologia' },
      { key: 'birdwatching', label: '🦅 Birdwatching' }
    ],
    lifestyle: [
      { key: 'moda', label: '👗 Moda' },
      { key: 'bellezza', label: '💄 Bellezza' },
      { key: 'wellness', label: '🧘‍♀️ Wellness' },
      { key: 'meditazione', label: '🕯️ Meditazione' },
      { key: 'spiritualità', label: '🔮 Spiritualità' },
      { key: 'shopping', label: '🛍️ Shopping' }
    ],
    business: [
      { key: 'imprenditoria', label: '💼 Imprenditoria' },
      { key: 'finanze', label: '💰 Finanze' },
      { key: 'investimenti', label: '📈 Investimenti' },
      { key: 'networking', label: '🤝 Networking' },
      { key: 'leadership', label: '👑 Leadership' },
      { key: 'marketing', label: '📊 Marketing' }
    ]
  };

  constructor(private themeService: ThemeServ) {}

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.getCurrentTheme() === 'dark';
  }

  // METODO FUNZIONANTE - Toggle del tema
  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkTheme = this.themeService.getCurrentTheme() === 'dark';
  }

  // Metodi per editing dei campi
  startEdit(fieldName: keyof EditingFields, inputElement?: ElementRef): void {
    this.backupValues[fieldName] = this.userProfile[fieldName];
    this.editingFields[fieldName] = true;

    if (inputElement) {
      setTimeout(() => inputElement.nativeElement.focus(), 0);
    }
  }

  saveField(fieldName: keyof EditingFields): void {
    this.editingFields[fieldName] = false;
    delete this.backupValues[fieldName];

    // TODO: Implementare chiamata API per salvare il campo
    console.log(`Salvando ${fieldName}:`, this.userProfile[fieldName]);

    // Placeholder per ora
    // this.userService.updateField(fieldName, this.userProfile[fieldName]);
  }

  cancelEdit(fieldName: keyof EditingFields): void {
    (this.userProfile as any)[fieldName] = this.backupValues[fieldName];
    this.editingFields[fieldName] = false;
    delete this.backupValues[fieldName];
  }

  // Metodi per preferenze di matching
  selectGender(gender: 'MASCHIO' | 'FEMMINA'): void {
    this.preferences.generePreferito = gender;
    console.log('Genere preferito selezionato:', gender);

    // TODO: Implementare salvataggio automatico delle preferenze
    // this.preferencesService.updateGender(gender);
  }

  updateAgeRange(): void {
    console.log(`Fascia d'età aggiornata: ${this.preferences.minEta} - ${this.preferences.maxEta}`);

    // TODO: Implementare salvataggio automatico
    // this.preferencesService.updateAgeRange(this.preferences.minEta, this.preferences.maxEta);
  }

  updateDistance(): void {
    console.log('Distanza massima aggiornata:', this.preferences.distanzaMax, 'km');

    // TODO: Implementare salvataggio automatico
    // this.preferencesService.updateDistance(this.preferences.distanzaMax);
  }

  // Metodi per notifiche
  toggleNotifications(): void {
    this.userProfile.notificheAttive = !this.userProfile.notificheAttive;
    console.log('Notifiche attive:', this.userProfile.notificheAttive);

    // TODO: Implementare salvataggio
    // this.userService.updateNotifications(this.userProfile.notificheAttive);
  }

  // Metodi per gestione interessi
  openInterestsModal(): void {
    const modalElement = this.interestsModal.nativeElement;
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  isInterestSelected(interestKey: string): boolean {
    return this.selectedInterests.includes(interestKey);
  }

  toggleInterest(interestKey: string): void {
    if (this.isInterestSelected(interestKey)) {
      this.selectedInterests = this.selectedInterests.filter(i => i !== interestKey);
    } else {
      if (this.selectedInterests.length < 10) {
        this.selectedInterests.push(interestKey);
      } else {
        alert('Puoi selezionare massimo 10 interessi!');
        return;
      }
    }
  }

  filterInterests(): void {
    // Il filtro viene gestito tramite i metodi getCategoryDisplay e getInterestDisplay
  }

  getCategoryDisplay(categoryKey: string): string {
    if (!this.searchTerm.trim()) return 'block';

    const category = this.interestCategories[categoryKey as keyof typeof this.interestCategories];
    const hasVisibleInterests = category.some(interest =>
      interest.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    return hasVisibleInterests ? 'block' : 'none';
  }

  getInterestDisplay(interestLabel: string): string {
    if (!this.searchTerm.trim()) return 'inline-block';

    return interestLabel.toLowerCase().includes(this.searchTerm.toLowerCase())
      ? 'inline-block'
      : 'none';
  }

  getSelectedInterestsDisplay(): string[] {
    return this.selectedInterests.map(key =>
      this.interestDisplayMap[key] || key
    );
  }

  saveInterests(): void {
    console.log('Interessi salvati:', this.selectedInterests);

    // TODO: Implementare salvataggio
    // this.userService.updateInterests(this.selectedInterests);

    // Chiudi modal
    const modalElement = this.interestsModal.nativeElement;
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  // Metodi per cambio password
  openPasswordModal(): void {
    const modalElement = this.passwordModal.nativeElement;
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  changePassword(): void {
    // Validazione
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('❌ Le password non coincidono!');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      alert('❌ La password deve contenere almeno 6 caratteri!');
      return;
    }

    if (!this.passwordData.currentPassword) {
      alert('❌ Inserisci la password attuale per cambiarla!');
      return;
    }

    console.log('Cambiando password...');

    // TODO: Implementare cambio password
    // this.authService.changePassword(this.passwordData);

    alert('✅ Password cambiata con successo!');

    // Reset e chiudi modal
    this.resetPasswordModal();
  }

  private resetPasswordModal(): void {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    const modalElement = this.passwordModal.nativeElement;
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  // Metodo per disattivazione account
  deactivateAccount(): void {
    if (confirm('⚠️ Sei sicuro di voler disattivare il tuo account? Questa azione non può essere annullata.')) {
      console.log('Disattivando account...');

      // TODO: Implementare disattivazione account
      // this.userService.deactivateAccount();

      alert('Account disattivato. Ci mancherai! 💔');
    }
  }
}
