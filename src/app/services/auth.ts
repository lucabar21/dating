import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  public isLoggedIn = signal(!!localStorage.getItem('auth_token'));

  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/register`, { email, password });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }
  // private tokenKey = 'auth_token';

  // loggedIn = signal(false);

  // public syncFromStorage() {
  //   this.loggedIn.set(!!localStorage.getItem(this.tokenKey));
  // }

  // constructor(private http: HttpClient, private router: Router) {
  //   this.syncFromStorage();
  // }

  // login(credentials: { username: string; password: string }) {
  //   console.log('Sending credentials to backend:', credentials);
  //   return this.http.post<any>(
  //     'http://localhost:8080/api/v1/sessions/login',
  //     credentials
  //   );
  // }

  // performLogin(credentials: { username: string; password: string }): void {
  //   this.login(credentials).subscribe({
  //     next: (response) => {
  //       if (response.success) {
  //         localStorage.setItem('auth_token', response.sessiondata.token);
  //         localStorage.setItem('userId', response.sessiondata.userId);
  //         localStorage.setItem('username', response.sessiondata.username);

  //         this.syncFromStorage();

  //         this.router.navigate(['/dashboard']);
  //       } else {
  //         alert('Login failed: ' + response.message);
  //       }
  //     },
  //     error: (err) => {
  //       alert('Server error during login.');
  //       console.error(err);
  //     },
  //   });
  // }

  // logout() {
  //   localStorage.removeItem(this.tokenKey);
  //   localStorage.removeItem('userId');
  //   localStorage.removeItem('username');
  //   this.syncFromStorage();
  //   this.router.navigate(['/login']);
  // }

  // getLoggedUser(): any | null {
  //   return {
  //     token: this.getToken(),
  //     userId: this.getUserId(),
  //     username: localStorage.getItem('username'),
  //   };
  // }
  // isLoggedIn(): boolean {
  //   return this.loggedIn();
  // }

  // getUserId(): number {
  //   return +localStorage.getItem('userId')!;
  // }

  // getToken(): string | null {
  //   return localStorage.getItem(this.tokenKey);
  // }
}
