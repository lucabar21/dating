import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageServ {
  apiURL = environment.apiUrl;
  private http = inject(HttpClient);

  // 🔥 METODO PER HEADERS DI AUTENTICAZIONE (copia da altri servizi)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Metodo per ottenere i messaggi di un match
  getMessages(matchId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}match/${matchId}/messaggi`, {
      headers: this.getAuthHeaders() // 🔥 AGGIUNGI HEADERS
    });
  }

  // Metodo per inviare un messaggio in un match
  sendMessage(matchId: number, message: any): Observable<string> {
    return this.http.post(`${this.apiURL}match/${matchId}/messaggi`, message, {
      headers: this.getAuthHeaders(), // 🔥 AGGIUNGI HEADERS
      responseType: 'text'            // 🔥 BACKEND RESTITUISCE STRINGA
    });
  }
}
