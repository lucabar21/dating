import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface per i dati utente dal backend
export interface UserData {
  id: number;
  nome: string;
  bio: string;
  interessi: string; // Stringa separata da virgola
  fotoProfilo: string;
  citta: string;
  eta: number;
  accountType?: 'GOLD' | 'PLATINUM' | 'PREMIUM' | 'STANDARD'; // Tipi specifici
}

@Injectable({
  providedIn: 'root',
})
export class UserServ {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('UserServ initialized with baseUrl:', this.baseUrl);
  }

  /**
   * Ottiene il profilo dell'utente corrente
   */
  getCurrentUser(): Observable<UserData> {
    return this.http.get<UserData>(`${this.baseUrl}utenti/me`);
  }

  /**
   * Aggiorna il profilo dell'utente
   */
  updateUser(userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}utenti/me`, userData);
  }

  /**
   * Ottiene tutti gli utenti (per test/admin)
   */
  getAllUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.baseUrl}utenti`);
  }

  /**
   * Ottiene il profilo pubblico di un utente
   */
  getUserProfile(userId: number): Observable<UserData> {
    return this.http.get<UserData>(`${this.baseUrl}utenti/${userId}`);
  }

  getDiscoverableUsers() {
    return this.http.get<UserData>(`${this.baseUrl}utenti/discover`);
  }
}
