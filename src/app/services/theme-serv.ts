import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeServ {
   private themeKey = 'theme';
   private themeSubject = new BehaviorSubject<'light' | 'dark'>(this.getSavedTheme());
  theme$ = this.themeSubject.asObservable(); // <-- osservabile accessibile

  constructor() {
    this.setTheme(this.themeSubject.value); // imposta il tema al primo avvio
    // this.loadSavedTheme();
  }

  setTheme(theme: 'light' | 'dark'): void {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem(this.themeKey, theme);
    this.themeSubject.next(theme); // <-- notifica ai subscriber
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): 'light' | 'dark' {
    // return (localStorage.getItem(this.themeKey) as 'light' | 'dark') || 'light';
    return this.themeSubject.value;
  }

  // private loadSavedTheme(): void {
  //   this.setTheme(this.getCurrentTheme());
  // }
   private getSavedTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.themeKey) as 'light' | 'dark') || 'light';
  }
}
