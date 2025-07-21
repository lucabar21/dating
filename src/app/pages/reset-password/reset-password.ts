import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { ThemeServ } from '../../services/theme-serv';
import { Subscription } from 'rxjs';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Footer],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPassword implements OnInit, OnDestroy {
  isDarkTheme: boolean = false;
  private themeSub!: Subscription;
  hearts = Array.from({ length: 30 });

  // Stati del componente
  loading: boolean = true;
  validToken: boolean = false;
  isSubmitting: boolean = false;

  // Messaggi
  successMessage: string = '';
  errorMessage: string = '';

  // Token dalla URL
  resetToken: string = '';

// Validatore personalizzato per password match

passwordMatchValidator = (control: any) => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
};

// Form per reset password
resetForm = new FormGroup({
  newPassword: new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]),
  confirmPassword: new FormControl('', [
    Validators.required
  ])
}, this.passwordMatchValidator);

constructor(
  private authService: AuthService,
  private router: Router,
  private route: ActivatedRoute,
  private themeService: ThemeServ
) {}

ngOnInit(): void {
  this.themeSub = this.themeService.theme$.subscribe((theme) => {
    this.isDarkTheme = theme === 'dark';
  });

  // Ottieni il token dalla URL
  this.route.queryParams.subscribe(params => {
    this.resetToken = params['token'];
    if (this.resetToken) {
      this.validateToken();
    } else {
      this.loading = false;
      this.validToken = false;
    }
  });
}

ngOnDestroy(): void {
  this.themeSub?.unsubscribe();
}

  // Valida il token (opzionale - per ora assumiamo sia valido)
  validateToken(): void {
    this.loading = true;

    // Per ora assumiamo che il token sia valido se esiste
    // In futuro potresti aggiungere una chiamata API per validare il token
    setTimeout(() => {
      this.validToken = true;
      this.loading = false;
    }, 1000);
  }

  // Reset password
  onResetPassword(): void {
    if (this.resetForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const newPassword = this.resetForm.get('newPassword')?.value || '';

    this.authService.resetPassword(this.resetToken, newPassword).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Password aggiornata con successo! Ora puoi accedere.';

        // Redirect al login dopo 3 secondi
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Errore durante l\'aggiornamento della password';
        console.error('❌ Errore reset password:', error);
      }
    });
  }

  // Segna tutti i campi come toccati per mostrare errori
  private markFormGroupTouched(): void {
    Object.keys(this.resetForm.controls).forEach(key => {
      this.resetForm.get(key)?.markAsTouched();
    });
  }

  // Get error messages
  getPasswordError(): string {
    const control = this.resetForm.get('newPassword');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Password richiesta';
      if (control.errors['minlength']) return 'Password deve essere di almeno 6 caratteri';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    const control = this.resetForm.get('confirmPassword');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Conferma password richiesta';
    }
    if (this.resetForm.errors && this.resetForm.errors['passwordMismatch']) {
      return 'Le password non coincidono';
    }
    return '';
  }

  // Heart rain animation
  generateStyle() {
    return {
      '--random-left': Math.random().toString(),
      '--random-speed': Math.random().toString(),
      '--random-size': (Math.random() * 1.5 + 1).toString(),
      '--random-blur': (Math.random() * 4).toFixed(1) + 'px',
    } as any;
  }
}
