import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface City {
  name: string;
  fullName: string;
  provincia: string;
  regione: string;
  latitude?: number;
  longitude?: number;
}

interface ComuneJson {
  nome: string;
  provincia: { nome: string; };
  regione: { nome: string; };
  cap: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private comuni: ComuneJson[] = [];
  private comuniLoaded = false;

  constructor(private http: HttpClient) {}

  // 🔥 CARICA COMUNI DAL JSON
  private async loadComuni(): Promise<void> {
    if (this.comuniLoaded) return;

    try {
      const data = await this.http.get<ComuneJson[]>('../../assets/comuni.json').toPromise();
      this.comuni = data || [];
      this.comuniLoaded = true;
      console.log('✅ Caricati', this.comuni.length, 'comuni italiani');
    } catch (error) {
      console.error('❌ Errore caricamento comuni:', error);
      this.comuni = [];
    }
  }

  // 🔥 AUTOCOMPLETAMENTO VELOCE da file JSON
  async searchItalianCities(query: string): Promise<City[]> {
    if (query.length < 2) return [];

    await this.loadComuni();
    const searchTerm = query.toLowerCase().trim();

    return this.comuni
      .filter(comune => comune.nome.toLowerCase().includes(searchTerm))
      .slice(0, 8)
      .map(comune => ({
        name: comune.nome,
        fullName: `${comune.nome}, ${comune.provincia.nome}, ${comune.regione.nome}`,
        provincia: comune.provincia.nome,
        regione: comune.regione.nome
      }));
  }

  // 🔥 OTTIENI COORDINATE da Nominatim (per salvataggio)
  async getCityCoordinates(cityName: string, provincia: string): Promise<{latitude: number, longitude: number} | null> {
    try {
      const query = `${cityName}, ${provincia}, Italia`;
      const url = `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `countrycodes=it&` +
        `format=json&limit=1`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Errore coordinate:', error);
      return null;
    }
  }
}
