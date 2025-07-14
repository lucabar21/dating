import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UserServ {

  // 🔥 STRINGA DI CONNESSIONE - ESEMPIO PER COLLEGHI
  private baseUrl = environment.apiUrl; // http://localhost:8080/api in dev, URL produzione in prod

  constructor(private http: HttpClient) {
    // Debug per vedere quale URL sta usando
    console.log('UserServ initialized with baseUrl:', this.baseUrl);
  }

  // Esempio metodi che useranno la baseUrl
  getCurrentUser() {
    return this.http.get(`${this.baseUrl}/utenti/me`);
  }

  updateUser(userData: any) {
    return this.http.put(`${this.baseUrl}/utenti/me`, userData);
  }

  getAllUsers() {
  return this.http.get(`${this.baseUrl}/utenti`);
}

  // Altri metodi seguono lo stesso pattern:
  // this.http.get(`${this.baseUrl}/endpoint`)
}
