import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { ThemeServ } from '../../services/theme-serv';
import { Subscription } from 'rxjs';
import { Footer } from '../../components/footer/footer';

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

  constructor(private themeService: ThemeServ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.theme$.subscribe((theme) => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      //Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    }, 
    { validators: passwordsMatchValidator }
);

  /*get passwordMatchError(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirm = this.registerForm.get('confirmPassword')?.value;
    const touched = this.registerForm.get('confirmPassword')?.touched;

    return password !== confirm && !!touched;
  }*/
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
          if (response && response.token) {
            this.router.navigate(['/login']);
          }
          this.registerForm.reset();
        },
        error: (error: any) => {
          console.error('Errore nella registrazione:', error);
          if (error.status === 409 || error.status === 400) {
            alert('Email già in uso');
          } else {
            alert('Errore durante la registrazione');
          }
          this.registerForm.reset();
        },
      });
    }
  }

  generateStyle() {
    return {
      '--random-left': Math.random().toString(),
      '--random-speed': Math.random().toString(),
      '--random-size': (Math.random() * 1.5 + 1).toString(),
      '--random-blur': (Math.random() * 4).toFixed(1) + 'px', // 0 – 3px
    } as any;
  }
}


// ✅ Custom validator
export const passwordsMatchValidator: ValidatorFn = (form: AbstractControl): { [key: string]: any } | null => {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
};
