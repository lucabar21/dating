import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatchServ {
  apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}match`);
  }
}
