import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  public isLoggedIn = signal(!!localStorage.getItem('auth_token'));

  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}auth/login`, { email, password });
  }

  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}auth/register`, { email, password });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  // 🔥 METODO RECUPERO PASSWORD
   forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}auth/forgot-password`, { email });
}

// 🔥 METODO RESET PASSWORD
resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}auth/reset-password`, {
    token: token,
    newPassword: newPassword
  });
}
}
