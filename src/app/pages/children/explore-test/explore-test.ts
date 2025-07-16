import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserData, UserServ } from '../../../services/user-serv';
import { Swipe, SwipeData } from '../../../services/swipe';

@Component({
  selector: 'app-explore-test',
  imports: [CommonModule, RouterModule],
  templateUrl: './explore-test.html',
  styleUrl: './explore-test.css',
})
export class ExploreTest {
  discoverableUsers = signal<UserData[]>([]);
  isPremium = signal(false);

  private userService = inject(UserServ);
  private swipeService = inject(Swipe);

  checkAccountType() {
    const accountType = localStorage.getItem('account_type');

    if (
      accountType === 'GOLD' ||
      accountType === 'PLATINUM' ||
      accountType === 'PREMIUM'
    ) {
      this.isPremium.set(true);
    }
  }

  getDiscoverableUsers() {
    this.userService.getDiscoverableUsers().subscribe({
      next: (users) => {
        this.discoverableUsers.set(Array.isArray(users) ? users : [users]);
      },
      error: (error) => {
        console.error('Error fetching discoverable users:', error);
      },
    });
  }

  swipe(tipo: string, target: number) {
    const data: SwipeData = {
      utenteTargetId: target,
      tipo: tipo as 'LIKE' | 'PASS' | 'SUPER_LIKE',
    };

    this.swipeService.makeSwipe(data);
  }

  ngOnInit() {
    this.getDiscoverableUsers();
    this.checkAccountType();
  }
}
