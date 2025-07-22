import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageServ {
  // Subject per ricaricare la chat quando viene inviato un nuovo messaggio
  private reloadChatSubject = new Subject<number>();
  // Observable che permette di ricaricare la chat quando viene inviato un nuovo messaggio
  reloadChat$ = this.reloadChatSubject.asObservable();

  apiURL = environment.apiUrl;
  private http = inject(HttpClient);

  // Metodo per ottenere i messaggi di un match
  getMessages(matchId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}match/${matchId}/messaggi`);
  }

  // Metodo per inviare un messaggio in un match
  sendMessage(matchId: number, message: any): Observable<any> {
    return this.http.post(`${this.apiURL}match/${matchId}/messaggi`, message);
  }

  // Metodo per ottenere i messaggi di un match e ricaricare la chat
  emitReload(matchId: number) {
    this.reloadChatSubject.next(matchId);
  }
}
