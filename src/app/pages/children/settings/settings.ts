import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeServ } from '../../../services/theme-serv';
import { UserServ } from '../../../services/user-serv';
import { Spinner } from '../../../components/spinner/spinner';
import { CityService, City } from '../../../services/city.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

// Interface per i dati utente dal backend
interface UserProfile {
  id: number;
  nome: string;
  username: string; // Email dell'utente
  genere: 'MASCHIO' | 'FEMMINA' | null; // Genere dell'utente
  bio: string;
  interessi: string; // Stringa dal backend (da convertire in array)
  fotoProfilo: string;
  citta: string;
  eta: number;
  dataNascita: string;
  notificheAttive: boolean;
  profileImageUrl?: string; // Per l'anteprima locale
}

// Interface per i dati di aggiornamento profilo
interface UpdateUserData {
  username: string;
  password: string;
  newPassword?: string;
  nome: string;
  bio: string;
  interessi: string;
  città: string;
  dataNascita: string;
  genere: string;
  fotoProfilo: string;
  notificheAttive?: boolean;
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
  citta: boolean;
  dataNascita: boolean;
  genere: boolean;
}

interface Interest {
  key: string;
  label: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, Spinner],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
})
export class Settings implements OnInit {
  selectedTab: string = 'account';

  @ViewChild('interestsModal') interestsModal!: ElementRef;
  @ViewChild('passwordModal') passwordModal!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // 🔥 NUOVI STATI PER LOADING
  loading: boolean = false;
  error: string | null = null;
  saving: boolean = false;

  // Variabili per tema
  isDarkTheme: boolean = false;

  // Variabili per gestione immagine di profilo
  isUploadingImage: boolean = false;
  maxFileSize: number = 5 * 1024 * 1024; // 5MB
  allowedImageTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  // 🔥 PROFILO UTENTE - INIZIALIZZATO VUOTO (CARICATO DAL BACKEND)
  userProfile: UserProfile = {
    id: 0,
    nome: '',
    username: '',
    genere: null,
    bio: '',
    interessi: '',
    fotoProfilo: '',
    citta: '',
    eta: 0,
    dataNascita: '',
    notificheAttive: false,
    profileImageUrl: '',
  };

  // 🔥 PREFERENZE - CARICATE DAL BACKEND
  preferences: Preferences = {
    generePreferito: null,
    minEta: 18,
    maxEta: 65,
    distanzaMax: 50,
  };

  // Dati per cambio password
  passwordData: PasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  // Stato editing dei campi
  editingFields: EditingFields = {
    nome: false,
    username: false,
    bio: false,
    citta: false,
    dataNascita: false,
    genere: false,
  };

  // Backup values per cancel edit
  private backupValues: any = {};

  // 🔥 INTERESSI - CARICATI DAL BACKEND
  selectedInterests: string[] = [];

  // Termine di ricerca per filtro interessi
  searchTerm: string = '';

  // 🔥 PROPRIETÀ PER AUTOCOMPLETAMENTO CITTÀ
  selectedCity: any = null;
  citySuggestions: City[] = [];
  showCitySuggestions: boolean = false;
  cityQuery: string = '';

  // Mappa degli interessi per display (già esistente)
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

  // Categorie di interessi (già esistenti)
  interestCategories = {
    sport: [
      { key: 'sport', label: '⚽ Sport' },
      { key: 'calcio', label: '⚽ Calcio' },
      { key: 'palestra', label: '🏋️ Palestra' },
      { key: 'corsa', label: '🏃 Corsa' },
      { key: 'nuoto', label: '🏊 Nuoto' },
      { key: 'tennis', label: '🎾 Tennis' },
      { key: 'basket', label: '🏀 Basket' },
      { key: 'yoga', label: '🧘 Yoga' },
      { key: 'ciclismo', label: '🚴 Ciclismo' },
      { key: 'arrampicata', label: '🧗 Arrampicata' },
      { key: 'sci', label: '⛷️ Sci' },
    ],
    arte: [
      { key: 'musica', label: '🎵 Musica' },
      { key: 'concerti', label: '🎤 Concerti' },
      { key: 'pittura', label: '🎨 Pittura' },
      { key: 'fotografia', label: '📸 Fotografia' },
      { key: 'teatro', label: '🎭 Teatro' },
      { key: 'danza', label: '💃 Danza' },
      { key: 'disegno', label: '✏️ Disegno' },
      { key: 'scultura', label: '🗿 Scultura' },
    ],
    viaggi: [
      { key: 'viaggi', label: '✈️ Viaggi' },
      { key: 'backpacking', label: '🎒 Backpacking' },
      { key: 'camping', label: '⛺ Camping' },
      { key: 'escursionismo', label: '🥾 Escursionismo' },
      { key: 'roadtrip', label: '🚗 Road Trip' },
      { key: 'spiaggia', label: '🏖️ Spiaggia' },
      { key: 'montagna', label: '🏔️ Montagna' },
      { key: 'culture', label: '🏛️ Culture' },
    ],
    cibo: [
      { key: 'cucina', label: '🍕 Cucina' },
      { key: 'vino', label: '🍷 Vino' },
      { key: 'birra', label: '🍺 Birra' },
      { key: 'caffè', label: '☕ Caffè' },
      { key: 'ristoranti', label: '🍽️ Ristoranti' },
      { key: 'dolci', label: '🧁 Dolci' },
      { key: 'street-food', label: '🌮 Street Food' },
      { key: 'vegano', label: '🥗 Vegano' },
    ],
    tech: [
      { key: 'gaming', label: '🎮 Gaming' },
      { key: 'programmazione', label: '💻 Programmazione' },
      { key: 'tecnologia', label: '📱 Tecnologia' },
      { key: 'ai', label: '🤖 AI' },
      { key: 'crypto', label: '₿ Crypto' },
      { key: 'gadget', label: '⌚ Gadget' },
      { key: 'esports', label: '🏆 E-Sports' },
    ],
    cultura: [
      { key: 'lettura', label: '📚 Lettura' },
      { key: 'cinema', label: '🎬 Cinema' },
      { key: 'serie-tv', label: '📺 Serie TV' },
      { key: 'podcast', label: '🎧 Podcast' },
      { key: 'fumetti', label: '📖 Fumetti' },
      { key: 'poesia', label: '📝 Poesia' },
      { key: 'documentari', label: '🎥 Documentari' },
    ],
    natura: [
      { key: 'cani', label: '🐕 Cani' },
      { key: 'gatti', label: '🐱 Gatti' },
      { key: 'animali', label: '🦋 Animali' },
      { key: 'giardinaggio', label: '🌱 Giardinaggio' },
      { key: 'ecologia', label: '🌍 Ecologia' },
      { key: 'birdwatching', label: '🦅 Birdwatching' },
    ],
    lifestyle: [
      { key: 'moda', label: '👗 Moda' },
      { key: 'bellezza', label: '💄 Bellezza' },
      { key: 'wellness', label: '🧘‍♀️ Wellness' },
      { key: 'meditazione', label: '🕯️ Meditazione' },
      { key: 'spiritualità', label: '🔮 Spiritualità' },
      { key: 'shopping', label: '🛍️ Shopping' },
    ],
    business: [
      { key: 'imprenditoria', label: '💼 Imprenditoria' },
      { key: 'finanze', label: '💰 Finanze' },
      { key: 'investimenti', label: '📈 Investimenti' },
      { key: 'networking', label: '🤝 Networking' },
      { key: 'leadership', label: '👑 Leadership' },
      { key: 'marketing', label: '📊 Marketing' },
    ],
  };

  constructor(
    private themeService: ThemeServ,
    private userServ: UserServ,
    private cityService: CityService,
    private route: ActivatedRoute
  ) {}

  /****************************************************************************************************/
  // 🔥 METODI PER CARICAMENTO DATI REALI
  /****************************************************************************************************/

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.getCurrentTheme() === 'dark';
    this.loadUserProfile(); // Carica dati reali
    this.loadPreferences();
    this.route.queryParams.subscribe((params) => {
      if (params['tab']) {
        this.selectedTab = params['tab'];
      }
    });
  }

  /**
   * 🔥 CARICA PROFILO UTENTE DAL BACKEND
   */
  loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    this.userServ.getCurrentUser().subscribe({
      next: (response: any) => {
        console.log('✅ Profilo caricato in Settings:', response);

        // Aggiorna il profilo utente
        this.userProfile = {
          id: response.id,
          nome: response.nome || '',
          genere: response.genere || '', // 🔥 ORA FUNZIONA
          username: response.username || '', // 🔥 ORA FUNZIONA (email reale)
          bio: response.bio || '',
          interessi: response.interessi || '',
          fotoProfilo: response.fotoProfilo || '',
          citta: response.citta || '',
          eta: response.eta || 0,
          dataNascita: this.formatDateForInput(response.dataNascita) || '', // 🔥 ORA FUNZIONA
          notificheAttive: response.notificheAttive || false,
          profileImageUrl: response.fotoProfilo || '',
        };

        // Converte interessi da stringa a array
        this.updateSelectedInterestsFromString(response.interessi);

        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Errore caricamento profilo:', error);
        this.error = 'Errore nel caricamento del profilo. Riprova più tardi.';
        this.loading = false;
      },
    });
  }

  // 🔥 CARICA PREFERENZE REALI
  loadPreferences(): void {
    this.userServ.getPreferences().subscribe({
      next: (response: any) => {
        console.log('✅ Preferenze caricate:', response);
        this.preferences = {
          generePreferito: response.generePreferito,
          minEta: response.minEta || 18,
          maxEta: response.maxEta || 65,
          distanzaMax: response.distanzaMax || 50,
        };
      },
      error: (error) => {
        console.error('❌ Errore caricamento preferenze:', error);
      },
    });
  }

  // 🔥 SALVA PREFERENZE REALI
  savePreferences(): void {
    this.saving = true;

    const preferencesData = {
      generePreferito: this.preferences.generePreferito,
      minEta: this.preferences.minEta,
      maxEta: this.preferences.maxEta,
      distanzaMax: this.preferences.distanzaMax,
    };

    this.userServ.updatePreferences(preferencesData).subscribe({
      next: (response) => {
        console.log('✅ Preferenze salvate:', response);
        this.saving = false;
        this.showSuccessMessage('Preferenze salvate!');
      },
      error: (error) => {
        console.error('❌ Errore salvataggio preferenze:', error);
        this.saving = false;
        this.showErrorMessage('Errore durante il salvataggio');

      },
    });
  }

  /**
   * 🔥 CONVERTE STRINGA INTERESSI IN ARRAY
   */
  updateSelectedInterestsFromString(interessiString: string): void {
    if (!interessiString || interessiString.trim() === '') {
      this.selectedInterests = [];
      return;
    }

    this.selectedInterests = interessiString
      .split(',')
      .map((interest) => interest.trim().toLowerCase())
      .filter((interest) => interest.length > 0);

    console.log('🔥 Interessi convertiti:', this.selectedInterests);
  }

  /**
   * 🔥 RICARICA PROFILO IN CASO DI ERRORE
   */
  retryLoadProfile(): void {
    this.loadUserProfile();
  }

  /****************************************************************************************************/
  // 🔥 METODI PER SALVATAGGIO DATI REALI
  /****************************************************************************************************/

  /**
   * Formatta data per input date
   */
  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';

    // Se è già nel formato YYYY-MM-DD, ritorna così
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }

    // Altrimenti prova a parsarla e convertirla
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  /**
   * 🔥 CREA OGGETTO DATI PER AGGIORNAMENTO
   */
  private createUpdateData(): UpdateUserData {
    return {
      username: this.userProfile.username,
      password: '',
      nome: this.userProfile.nome || '', // Sempre stringa
      bio: this.userProfile.bio || '', // Sempre stringa
      interessi: this.selectedInterests.join(', '),
      città: this.userProfile.citta || '', // Sempre stringa
      dataNascita: this.userProfile.dataNascita || '1990-01-01', // 🔥 DATA DEFAULT
      genere: this.userProfile.genere || 'MASCHIO', // 🔥 GENERE DEFAULT
      fotoProfilo: this.userProfile.fotoProfilo || '',
      notificheAttive: this.userProfile.notificheAttive || false,
    };
  }

  /**
   * 🔥 SALVA CAMPO MODIFICATO
   */
  saveField(fieldName: keyof EditingFields): void {
    this.editingFields[fieldName] = false;
    delete this.backupValues[fieldName];

    this.saving = true;
    const updateData = this.createUpdateData();

    console.log(`🔥 Salvando ${fieldName}:`, updateData);

    this.userServ.updateUser(updateData).subscribe({
      next: (response) => {
        console.log('✅ Campo salvato:', response);
        this.saving = false;

        // Aggiorna il profilo con i dati ricevuti
        if (response) {
          this.userProfile = { ...this.userProfile, ...response };
        }

        // Mostra feedback
        this.showSuccessMessage(`${fieldName} aggiornato con successo!`);
      },
      error: (error) => {
        console.error('❌ Errore salvataggio:', error);
        this.saving = false;
        this.showErrorMessage(
          `Errore durante l'aggiornamento di ${fieldName}`
        );
      },
    });
  }

  /**
   * 🔥 SALVA INTERESSI
   */
  saveInterests(): void {
    if (this.selectedInterests.length === 0) {
      alert('⚠️ Seleziona almeno un interesse!');
      return;
    }

    this.saving = true;
    const updateData = this.createUpdateData();

    console.log('🔥 Salvando interessi:', updateData);

    this.userServ.updateUser(updateData).subscribe({
      next: (response) => {
        console.log('✅ Interessi salvati:', response);
        this.saving = false;

        // Aggiorna il profilo
        this.userProfile.interessi = this.selectedInterests.join(', ');

        // Chiudi modal
        this.closeModal('interestsModal');

        // Mostra feedback
        this.showSuccessMessage('Interessi salvati con successo!');
      },
      error: (error) => {
        console.error('❌ Errore salvataggio interessi:', error);
        this.saving = false;
        this.showErrorMessage(
          'Errore durante il salvataggio degli interessi'
        );
      },
    });
  }

  /****************************************************************************************************/
  // 🔥 METODI DI UTILITÀ
  /****************************************************************************************************/

  /**
   * 🔥 MOSTRA MESSAGGIO DI SUCCESSO
   */
  private showSuccessMessage(message: string): void {
    // TODO: Implementare toast/notifica più elegante

    Swal.fire({
      icon: 'success',
      title: message,
      confirmButtonText: 'OK',
    });
  }

  /**
   * 🔥 MOSTRA MESSAGGIO DI ERRORE
   */
  private showErrorMessage(message: string): void {
    // TODO: Implementare toast/notifica più elegante
    Swal.fire({
      icon: 'error',
      title: message,
      confirmButtonText: 'OK',
    });
  }

  /**
   * 🔥 CHIUDE MODAL
   */
  private closeModal(modalName: string): void {
    const modalElement =
      modalName === 'interestsModal'
        ? this.interestsModal.nativeElement
        : this.passwordModal.nativeElement;

    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

  /****************************************************************************************************/
  // METODI ESISTENTI (mantenuti uguali ma aggiornati)
  /****************************************************************************************************/

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src =
      'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Verifica tipo immagine
    if (!this.allowedImageTypes.includes(file.type)) {
      this.showErrorMessage(
        'Formato immagine non supportato. Usa JPG, PNG, GIF o WEBP.'
      );
      return;
    }

    // Verifica dimensione
    if (file.size > this.maxFileSize) {
      this.showErrorMessage("L'immagine supera la dimensione massima di 5MB.");
      return;
    }

    // 🔥 MOSTRA LOADING
    this.isUploadingImage = true;

    // Legge l'immagine come base64
    const reader = new FileReader();
    reader.onload = () => {
      this.userProfile.profileImageUrl = reader.result as string;
      this.userProfile.fotoProfilo = reader.result as string;

      // 🔥 SALVA AUTOMATICAMENTE L'IMMAGINE
      const updateData = this.createUpdateData();

      console.log('🔥 Salvando immagine automaticamente...');

      this.userServ.updateUser(updateData).subscribe({
        next: (response) => {
          console.log('✅ Immagine salvata:', response);
          this.isUploadingImage = false;
          this.showSuccessMessage('Immagine profilo aggiornata!');

          // Aggiorna il profilo con i dati ricevuti
          if (response) {
            this.userProfile = { ...this.userProfile, ...response };
          }
        },
        error: (error) => {
          console.error('❌ Errore salvataggio immagine:', error);
          this.isUploadingImage = false;
          this.showErrorMessage(
            "Errore durante il salvataggio dell'immagine"
          );

          // Ripristina l'immagine precedente in caso di errore
          this.userProfile.profileImageUrl = this.userProfile.fotoProfilo;
        },
      });
    };
    reader.readAsDataURL(file);
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

  cancelEdit(fieldName: keyof EditingFields): void {
    (this.userProfile as any)[fieldName] = this.backupValues[fieldName];
    this.editingFields[fieldName] = false;
    delete this.backupValues[fieldName];
  }

  // Metodi per preferenze di matching
  selectGender(gender: 'MASCHIO' | 'FEMMINA'): void {
    this.preferences.generePreferito = gender;
  }

  updateAgeRange(): void {}

  updateDistance(): void {}

  // Metodi per notifiche
  toggleNotifications(): void {
    this.userProfile.notificheAttive = !this.userProfile.notificheAttive;
    console.log('🔥 Notifiche attive:', this.userProfile.notificheAttive);
    // TODO: Implementare salvataggio
  }

  // Metodi per gestione interessi
  openInterestsModal(): void {
    const modalElement = this.interestsModal.nativeElement;
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  isInterestSelected(interestKey: string): boolean {
    return this.selectedInterests.includes(interestKey.toLowerCase());
  }

  toggleInterest(interestKey: string): void {
    const lowerKey = interestKey.toLowerCase();

    if (this.isInterestSelected(lowerKey)) {
      this.selectedInterests = this.selectedInterests.filter(
        (i) => i !== lowerKey
      );
    } else {
      if (this.selectedInterests.length < 10) {
        this.selectedInterests.push(lowerKey);
      } else {
        this.showErrorMessage('Puoi selezionare massimo 10 interessi!');
        return;
      }
    }

    console.log('🔥 Interessi selezionati:', this.selectedInterests);
  }

  filterInterests(): void {
    // Il filtro viene gestito tramite i metodi getCategoryDisplay e getInterestDisplay
  }

  getCategoryDisplay(categoryKey: string): string {
    if (!this.searchTerm.trim()) return 'block';

    const category =
      this.interestCategories[
        categoryKey as keyof typeof this.interestCategories
      ];
    const hasVisibleInterests = category.some((interest) =>
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
    return this.selectedInterests.map(
      (key) => this.interestDisplayMap[key] || `🔸 ${key}`
    );
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
      this.showErrorMessage('Le password non coincidono!');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.showErrorMessage(
        'La password deve contenere almeno 6 caratteri!'
      );
      return;
    }

    if (!this.passwordData.currentPassword) {
      this.showErrorMessage('Inserisci la password attuale per cambiarla!');
      return;
    }

    this.saving = true;

    // 🔥 CREA DATI SPECIFICI PER CAMBIO PASSWORD
    const passwordChangeData = {
      username: this.userProfile.username,
      password: this.passwordData.currentPassword, // Password attuale
      newPassword: this.passwordData.newPassword, // Nuova password
      nome: this.userProfile.nome,
      bio: this.userProfile.bio,
      interessi: this.selectedInterests.join(', '),
      città: this.userProfile.citta,
      dataNascita: this.userProfile.dataNascita,
      genere: this.userProfile.genere || '',
      fotoProfilo: this.userProfile.fotoProfilo,
      notificheAttive: this.userProfile.notificheAttive,
    };

    console.log('🔥 Cambiando password...');

    this.userServ.updateUser(passwordChangeData).subscribe({
      next: (response) => {
        console.log('✅ Password cambiata:', response);
        this.saving = false;
        this.showSuccessMessage('Password cambiata con successo!');
        this.resetPasswordModal();
      },
      error: (error) => {
        console.error('❌ Errore cambio password:', error);
        this.saving = false;

        // 🔥 GESTIONE ERRORI SPECIFICI
        let errorMessage = 'Errore sconosciuto';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.showErrorMessage(errorMessage);
      },
    });
  }

  private resetPasswordModal(): void {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    this.closeModal('passwordModal');
  }



  // Metodo di test (mantenuto per debug)
  testConnection() {
    console.log('🔥 Testing connection to:', this.userServ['baseUrl']);
    this.userServ.getAllUsers().subscribe({
      next: (users: any) => {
        console.log('✅ SUCCESS! Users received:', users);
      },
      error: (error) => {
        console.error('❌ ERROR:', error);
      },
    });
  }

  // 🔥 METODI AGGIORNATI PER SISTEMA IBRIDO
  async searchCities(query: string): Promise<void> {
    this.cityQuery = query;

    if (query.length >= 2) {
      // 🔥 Autocompletamento veloce da file JSON
      this.citySuggestions = await this.cityService.searchItalianCities(query);
      this.showCitySuggestions = this.citySuggestions.length > 0;
      console.log('🔍 Città trovate:', this.citySuggestions);
    } else {
      this.citySuggestions = [];
      this.showCitySuggestions = false;
    }
  }

  onCitySelect(city: City): void {
    this.selectedCity = city;
    this.cityQuery = city.name;
    this.showCitySuggestions = false;

    console.log('🎯 Città selezionata:', city);
    // 🔥 NESSUN SALVATAGGIO QUI - solo selezione
  }

  // 🔥 NUOVO METODO per salvare con coordinate

  hideCitySuggestions(): void {
    setTimeout(() => (this.showCitySuggestions = false), 200);
  }

  // Metodo per salvare con coordinate
  saveFieldWithCoordinates(fieldName: string, lat: number, lng: number): void {
    this.saving = true;
    const updateData = this.createUpdateData();

    // 🔥 AGGIUNGI coordinate ai dati
    (updateData as any).latitudine = lat;
    (updateData as any).longitudine = lng;

    console.log('🔥 Salvando con coordinate:', updateData);

    this.userServ.updateUser(updateData).subscribe({
      next: (response) => {
        console.log('✅ Campo salvato con coordinate:', response);
        this.saving = false;
        this.showSuccessMessage(`${fieldName} aggiornato con successo!`);
      },
      error: (error) => {
        console.error('❌ Errore salvataggio:', error);
        this.saving = false;
        this.showErrorMessage(
          `Errore durante l'aggiornamento di ${fieldName}`
        );
      },
    });
  }

  // 🔥 METODI SPECIFICI PER CAMPO CITTÀ
  startEditCity(): void {
    this.editingFields.citta = true;
    this.cityQuery = this.userProfile.citta || '';
    this.selectedCity = null;
  }

  cancelEditCity(): void {
    this.editingFields.citta = false;
    this.cityQuery = '';
    this.selectedCity = null;
    this.showCitySuggestions = false;
  }

  async saveCityField(): Promise<void> {
    if (!this.selectedCity) {
      this.showErrorMessage('Seleziona una città dalla lista!');
      return;
    }

    this.saving = true;
    this.editingFields.citta = false;
    this.userProfile.citta = this.selectedCity.name;
    this.showCitySuggestions = false;

    try {
      // 🔥 Ottieni coordinate in background
      console.log('📍 Cercando coordinate per:', this.selectedCity.name);
      const coordinates = await this.cityService.getCityCoordinates(
        this.selectedCity.name,
        this.selectedCity.provincia
      );

      if (coordinates) {
        console.log('✅ Coordinate trovate:', coordinates);
        // Salva con coordinate
        this.saveFieldWithCoordinates(
          'citta',
          coordinates.latitude,
          coordinates.longitude
        );
      } else {
        console.log('⚠️ Coordinate non trovate, salvo solo nome città');
        // Salva solo nome città
        this.saveField('citta');
      }
    } catch (error) {
      console.error('❌ Errore nel salvataggio:', error);
      this.saving = false;
      this.showErrorMessage('Errore durante il salvataggio');
    }
  }


  // Metodo per disattivazione account
deactivateAccount(): void {
  // 🔥 CONFERMA CON SWEETALERT
  Swal.fire({
    icon: 'warning',
    title: 'Disattivare l\'account?',
    html: `
      <p><strong>⚠️ Questa azione disattiverà temporaneamente il tuo account.</strong></p>
      <br>
      <p>📋 <strong>Cosa succederà:</strong></p>
      <ul style="text-align: left; margin: 0 auto; display: inline-block;">
        <li>🚫 Non apparirai più nelle ricerche</li>
        <li>💬 Non potrai più inviare/ricevere messaggi</li>
        <li>👤 Il tuo profilo non sarà visibile</li>
        <li>🔄 Potrai riattivare l'account in qualsiasi momento</li>
      </ul>
      <br>
      <p><small>💡 Per riattivare l'account, contatta il supporto o prova ad accedere nuovamente.</small></p>
    `,
    showCancelButton: true,
    confirmButtonText: 'Sì, disattiva account',
    cancelButtonText: 'Annulla',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    focusCancel: true,
    reverseButtons: true,
    customClass: {
      popup: 'swal-deactivate-account'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.executeAccountDeactivation();
    }
  });
}

/**
 * 🔥 ESEGUE LA DISATTIVAZIONE REALE - VERSIONE CON MESSAGGIO CORRETTO
 */
private executeAccountDeactivation(): void {
  this.saving = true;

  // 🔥 CHIAMATA ALL'ENDPOINT BACKEND
  this.userServ.deactivateAccount().subscribe({
    next: (response: string) => {
      console.log('✅ Account disattivato:', response);
      this.saving = false;

      // 🔥 MESSAGGIO DI CONFERMA AGGIORNATO
      Swal.fire({
        icon: 'success',
        title: 'Utente disattivato con successo',
        html: `
          <p>💔 <strong>Il tuo account è stato disattivato con successo.</strong></p>
          <br>
          <p>Ci mancherai! 😢</p>
          <br>
          <p><strong>Verrai reindirizzato alla homepage.</strong></p>
        `,
        confirmButtonText: 'Vai alla Homepage',
        confirmButtonColor: '#e91e63',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        // 🔥 LOGOUT E REDIRECT ALLA HOMEPAGE
        this.performLogoutAndRedirect();
      });
    },
    error: (error) => {
      console.error('❌ Errore disattivazione account:', error);
      this.saving = false;

      let errorMessage = 'Errore durante la disattivazione dell\'account';

      // 🔥 GESTIONE MIGLIORATA DEGLI ERRORI
      if (error.status === 200) {
        // Se status è 200 ma c'è errore di parsing, probabilmente è riuscito
        console.log('⚠️ Disattivazione probabilmente riuscita, ma errore nel parsing della response');

        // 🔥 STESSO MESSAGGIO DI SUCCESSO ANCHE QUI
        Swal.fire({
          icon: 'success',
          title: 'Utente disattivato con successo',
          html: `
            <p>💔 <strong>Il tuo account è stato disattivato con successo.</strong></p>
            <br>
            <p>Ci mancherai! 😢</p>
            <br>
            <p><strong>Verrai reindirizzato alla homepage.</strong></p>
          `,
          confirmButtonText: 'Vai alla Homepage',
          confirmButtonColor: '#e91e63',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          this.performLogoutAndRedirect();
        });
        return;
      }

      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Errore',
        text: errorMessage,
        confirmButtonText: 'OK',
        confirmButtonColor: '#e91e63'
      });
    }
  });
}

/**
 * 🔥 LOGOUT E REDIRECT ALLA HOMEPAGE
 */
private performLogoutAndRedirect(): void {
  // Pulisci localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('primo_accesso');
  localStorage.removeItem('account_type');

  // 🔥 REDIRECT ALLA HOMEPAGE INVECE CHE AL LOGIN
  window.location.href = '/';
}


}
