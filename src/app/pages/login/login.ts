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
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit, OnDestroy {
  isDarkTheme: boolean = false;
  private themeSub!: Subscription;
  hearts = Array.from({ length: 30 });

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(private authService: AuthService, private router: Router, private themeService: ThemeServ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  onLogin(): void {
    let email = this.loginForm.get('email')?.value ?? '';
    let password = this.loginForm.get('password')?.value ?? '';

    if (this.loginForm.valid) {
      this.authService.login(email, password).subscribe((response: any) => {
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
      });
    }
  }

  // onLogin(): void {
  //   if (this.loginForm.valid) {
  //     this.authService.performLogin(this.loginForm.value);
  //   }
  // }

  generateStyle() {
    return {
      '--random-left': Math.random().toString(),
      '--random-speed': Math.random().toString(),
      '--random-size': (Math.random() * 1.5 + 1).toString(),
      '--random-blur': (Math.random() * 4).toFixed(1) + 'px', // 0 – 3px
    } as any;
  }
  
}
