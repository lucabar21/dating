import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { ThemeServ } from '../../services/theme-serv';
import { Subscription } from 'rxjs';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Footer],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit, OnDestroy {
  isDarkTheme: boolean = false;
  private themeSub!: Subscription;
  hearts = Array.from({ length: 30 });

  // 🔥 PROPRIETÀ PER RECUPERO PASSWORD
  showForgotModal: boolean = false;
  isLoading: boolean = false;
  resetMessage: string = '';

  //Gestione errore
  loginError: string = '';
  shake: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  // 🔥 FORM PER RECUPERO PASSWORD
  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeServ
  ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.theme$.subscribe((theme) => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  onLogin(): void {
    let email = this.loginForm.get('email')?.value ?? '';
    let password = this.loginForm.get('password')?.value ?? '';
    this.loginError = '';

    if (this.loginForm.valid) {
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          if (response && response.token) {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem(
              'primo_accesso',
              response.primoAccesso.toString()
            );
            localStorage.setItem('account_type', response.accountType);
            this.authService.isLoggedIn.set(true);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error: any) => {
          console.error('Errore durante il login:', error);

          // 🔥 GESTIONE SPECIFICA ACCOUNT NON ATTIVATO
          if (
            error.status === 400 &&
            error.error?.message?.includes('non attivato')
          ) {
            this.loginError = '📧 Account non attivo!';
            return;
          }

          // 🔥 GESTIONE ALTRI ERRORI 400
          if (error.status === 400) {
            this.loginError = error.error?.message || 'Errore durante il login';
            this.shake = true;
            setTimeout(() => (this.shake = false), 500);
            return;
          }

          // 🔥 GESTIONE ERRORI 401/403 (credenziali)
          if (error.status === 401 || error.status === 403) {
            this.loginError = 'Email o password errati! Riprova!';
          } else {
            this.loginError = 'Errore di connessione. Riprova più tardi.';
          }

          this.shake = true;
          setTimeout(() => (this.shake = false), 500);
        },
      });
    }
  }

  // 🔥 METODI PER RECUPERO PASSWORD
  openForgotPasswordModal(): void {
    this.showForgotModal = true;
    this.resetMessage = '';
    this.forgotForm.reset();
  }

  closeForgotModal(): void {
    this.showForgotModal = false;
    this.resetMessage = '';
    this.isLoading = false;
  }

  onForgotPassword(): void {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      const email = this.forgotForm.get('email')?.value ?? '';

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.resetMessage =
            '✅ Email di reset inviata! Controlla la tua casella di posta.';
          console.log('✅ Reset password richiesto per:', email);
        },
        error: (error) => {
          this.isLoading = false;
          this.resetMessage =
            "❌ Errore nell'invio. Verifica l'email e riprova.";
          console.error('❌ Errore reset password:', error);
        },
      });
    }
  }

  generateStyle() {
    return {
      '--random-left': Math.random().toString(),
      '--random-speed': Math.random().toString(),
      '--random-size': (Math.random() * 1.5 + 1).toString(),
      '--random-blur': (Math.random() * 4).toFixed(1) + 'px',
    } as any;
  }

  goBack(): void {
    this.router.navigate(['/']);
    this.authService.isLoggedIn.set(false);
    localStorage.removeItem('auth_token');
  }
}
