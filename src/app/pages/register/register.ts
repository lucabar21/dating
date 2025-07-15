import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  hearts = Array.from({ length: 30 });

  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

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
