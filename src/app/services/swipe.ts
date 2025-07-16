import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface SwipeData {
  utenteTargetId: number;
  tipo: 'LIKE' | 'PASS' | 'SUPER_LIKE';
}

@Injectable({
  providedIn: 'root',
})
export class Swipe {
  apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  makeSwipe(data: SwipeData): void {
    this.http.post(`${this.apiUrl}swipe`, data).subscribe({
      next: (response) => {
        console.log('Swipe response:', response);
      },
      error: (error) => {
        console.error('Error during swipe:', error);
      },
    });
  }
}
