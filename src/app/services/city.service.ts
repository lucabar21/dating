import { Injectable } from '@angular/core';

export interface City {
  name: string;
  fullName: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {

  async searchItalianCities(query: string): Promise<City[]> {
    if (query.length < 2) return [];

    try {
      // 🔥 NOMINATIM per città italiane
      const url = `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `countrycodes=it&` +
        `format=json&limit=8&addressdetails=1&` +
        `class=place&type=city,town,village`;

      const response = await fetch(url);
      const data = await response.json();

      return data.map((item: any) => ({
        name: this.extractCityName(item.display_name),
        fullName: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }));
    } catch (error) {
      console.error('❌ Errore ricerca città:', error);
      return [];
    }
  }

  private extractCityName(displayName: string): string {
    // Estrae solo il nome della città dal display_name completo
    return displayName.split(',')[0].trim();
  }
}
