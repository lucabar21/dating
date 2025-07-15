import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterModule],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
})
export class BottomNav {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
