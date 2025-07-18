import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeServ } from '../../services/theme-serv';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

   isDarkTheme: boolean = false;
   private themeSub!: Subscription;

  constructor(private themeServ: ThemeServ) {}

  ngOnInit(): void {
    this.themeSub = this.themeServ.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
      });
  }
  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
