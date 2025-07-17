import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Matches {
  apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getMatches() {
    return this.http.get(`${this.apiUrl}matches`).subscribe({
      next: (response) => {
        console.log('Matches response:', response);
      },
      error: (error) => {
        console.error('Error fetching matches:', error);
      },
    });
  }
}
