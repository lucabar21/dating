import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  hearts = Array.from({ length: 30 });

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.performLogin(this.loginForm.value);
    }
  }

  generateStyle() {
  return {
    '--random-left': Math.random().toString(),
    '--random-speed': Math.random().toString(),
    '--random-size': (Math.random() * 1.5 + 1).toString(),
    '--random-blur': (Math.random() * 4).toFixed(1) + 'px'   // 0 – 3px
  } as any;
}

}
