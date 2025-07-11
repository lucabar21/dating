import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeServ {
  private themeKey = 'theme';

  constructor() {
    this.loadSavedTheme();
  }

  setTheme(theme: 'light' | 'dark'): void {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem(this.themeKey, theme);
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.themeKey) as 'light' | 'dark') || 'light';
  }

  private loadSavedTheme(): void {
    this.setTheme(this.getCurrentTheme());
  }
}
