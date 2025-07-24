import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { ThemeServ } from '../../services/theme-serv';
import { Subscription } from 'rxjs';
import { Footer } from '../../components/footer/footer';
import Swal from 'sweetalert2'; // 🔥 IMPORT SWEETALERT

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, Footer],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit, OnDestroy {
  isDarkTheme: boolean = false;
  private themeSub!: Subscription;
  hearts = Array.from({ length: 30 });

  private authService = inject(AuthService);
  private router = inject(Router);
  emailAlreadyExistsError: string | null = null;


  constructor(private themeService: ThemeServ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.theme$.subscribe((theme) => {
      this.isDarkTheme = theme === 'dark';
    });

    // Clear the error if email changes
    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      this.emailAlreadyExistsError = null;
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatchValidator }
  );

  get passwordMatchError(): boolean {
    return (
      this.registerForm.hasError('passwordMismatch') &&
      !!this.registerForm.get('confirmPassword')?.touched
    );
  }

  registra() {
    let email = this.registerForm.get('email')?.value ?? '';
    let password = this.registerForm.get('password')?.value ?? '';

    if (this.registerForm.valid) {
      this.authService.register(email, password).subscribe({
        next: (response: any) => {
          console.log('Risposta ricevuta:', response);

          // 🔥 MOSTRA MESSAGGIO DI CONFERMA EMAIL CON SWEETALERT
          Swal.fire({
            icon: 'success',
            title: 'Registrazione completata!',
            html: `
              <p><strong>Controlla la tua email</strong> e clicca sul link di conferma per attivare l'account.</p>
              <p>📧 Email inviata a: <strong>${email}</strong></p>
              <br>
              <small>Non vedi l'email? Controlla anche la cartella spam.</small>
            `,
            confirmButtonText: 'Vai al Login',
            confirmButtonColor: '#e91e63',
            allowOutsideClick: false,
            customClass: {
              popup: 'swal-register-success',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });

          this.registerForm.reset();
        },
        error: (error: any) => {
          console.error('Errore nella registrazione:', error);


          // 🔥 GESTIONE ERRORI CON SWEETALERT
          /*
          let errorMessage = 'Errore durante la registrazione';

          if (error.status === 409 || error.status === 400) {
            if (
              error.error?.message &&
              error.error.message.includes('Email già in uso')
            ) {
              errorMessage =
                "Questa email è già registrata. Prova con un'altra email o accedi al tuo account.";
            }
          }
          */

          // Clear previous error
          this.emailAlreadyExistsError = null;

          // Show HTML error
          if (error.status === 409 || error.status === 400) {
            if (error.error?.message?.includes('Email già in uso')) {
              this.emailAlreadyExistsError = 'Questa email è già registrata. Prova con un\'altra email o accedi al tuo account.';
            } else {
              this.emailAlreadyExistsError = 'Errore nella registrazione. Riprova.';
            }
          } else {
            this.emailAlreadyExistsError = 'Errore nel server. Riprova più tardi.';
          }

          /*
          Swal.fire({
            icon: 'error',
            title: 'Registrazione fallita',
            text: errorMessage,
            confirmButtonText: 'Riprova',
            confirmButtonColor: '#e91e63',
          });
          
          this.registerForm.reset();
          */
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
}

// ✅ Custom validator
export const passwordsMatchValidator: ValidatorFn = (
  form: AbstractControl
): { [key: string]: any } | null => {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
};
