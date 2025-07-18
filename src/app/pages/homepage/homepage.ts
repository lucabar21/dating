import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeServ } from '../../services/theme-serv';
import { Subscription } from 'rxjs';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-homepage',
  imports: [RouterModule, Footer],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit, OnDestroy {
  isDarkTheme: boolean = false;
  private themeSub!: Subscription;

  constructor(private themeService: ThemeServ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.theme$.subscribe((theme) => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
