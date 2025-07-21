import { Router} from '@angular/router';
import { Component} from '@angular/core';

@Component({
  selector: 'app-placeholder-card',
  imports: [],
  templateUrl: './placeholder-card.html',
  styleUrl: './placeholder-card.css'
})
export class PlaceholderCard {
  constructor(private router: Router) {}

  public goToPreferences() {
    // Naviga con query parameter per aprire il tab matching
    this.router.navigate(['dashboard/settings'], {
      queryParams: { tab: 'matching' }
    });
  }

}
