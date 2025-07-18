import { Component, inject, OnInit, OnDestroy} from '@angular/core';
import { ThemeServ } from '../../services/theme-serv';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound implements OnInit, OnDestroy{
    isDarkTheme: boolean = false;
  private themeSub!: Subscription;
  goBack() {
    window.history.back();
  }
  constructor(private themeService: ThemeServ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
