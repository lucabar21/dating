import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServ, UserData } from '../../../services/user-serv';
import { Swipe, SwipeData } from '../../../services/swipe';
import { Spinner } from '../../../components/spinner/spinner';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, Spinner],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class Explore implements OnInit {
// Stati per loading ed errori
  loading: boolean = false;

  private userService = inject(UserServ);
  private swipeService = inject(Swipe);

  @ViewChild('cardContainer') cardContainer!: ElementRef;

  discoverableUsers = signal<UserData[]>([]);
  isPremium = signal(false);
  currentProfileIndex = 0;
  isAnimating = false;
  noMoreProfiles = false;

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
     this.loading = true;
    this.userService.getDiscoverableUsers().subscribe({
      next: (users) => {
        this.discoverableUsers.set(Array.isArray(users) ? users : [users]);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching discoverable users:', error);
        this.loading = false;
      },
    });
  }

  ngOnInit() {
    this.getDiscoverableUsers();
    this.checkAccountType();
  }

  // calculateCompatibilityScore(profile: UserProfile): number {
  //   // Calculate score based on common interests and proximity
  //   const commonInterests = profile.interessi.filter((interest) =>
  //     this.currentUser.interessi.includes(interest)
  //   );

  //   const interestScore = commonInterests.length * 10;
  //   const distanceScore = Math.max(0, 50 - profile.distanza); // Closer = higher score

  //   return interestScore + distanceScore;
  // }

  // getCommonInterests(profile: UserProfile): string[] {
  //   return profile.interessi.filter((interest) =>
  //     this.currentUser.interessi.includes(interest)
  //   );
  // }

  // getNextProfile(): UserProfile | null {
  //   const nextIndex = this.currentProfileIndex + 1;
  //   if (nextIndex >= this.matchingProfiles.length) {
  //     return null;
  //   }
  //   return this.matchingProfiles[nextIndex];
  // }

  swipe(tipo: string, target: number) {
    const data: SwipeData = {
      utenteTargetId: target,
      tipo: tipo as 'LIKE' | 'PASS' | 'SUPER_LIKE',
    };

    this.swipeService.makeSwipe(data);
  }

  swipeLeft(profile: any) {
    // if (this.isAnimating) return;
    // const targetProfile = profile || this.getCurrentProfile();
    // if (!targetProfile) return;
    // // For mobile: animate the swipe
    // if (window.innerWidth <= 768) {
    //   this.animateSwipe('left');
    // } else {
    //   // For desktop: remove the profile immediately
    //   this.removeProfile(targetProfile);
    // }
    // console.log('Swiped left on:', targetProfile.nome);
  }

  swipeRight(profile: any) {
    // if (this.isAnimating) return;
    // const targetProfile = profile || this.getCurrentProfile();
    // if (!targetProfile) return;
    // // For mobile: animate the swipe
    // if (window.innerWidth <= 768) {
    //   this.animateSwipe('right');
    // } else {
    //   // For desktop: remove the profile immediately
    //   this.removeProfile(targetProfile);
    // }
    // console.log('Swiped right on:', targetProfile.nome);
  }

  // removeProfile(profile: UserProfile) {
  //   const index = this.matchingProfiles.findIndex((p) => p.id === profile.id);
  //   if (index > -1) {
  //     this.matchingProfiles.splice(index, 1);
  //     if (this.matchingProfiles.length === 0) {
  //       this.noMoreProfiles = true;
  //     }
  //   }
  // }

  addToFavorites(profile: any) {
    // if (!this.likedProfiles.includes(profile)) {
    //   this.likedProfiles.push(profile);
    //   console.log('Added to favorites:', profile.nome);
    //   this.swipeRight(profile);
    // } else {
    //   console.log('Already in favorites.');
    // }
  }

  animateSwipe(direction: 'left' | 'right') {
    this.isAnimating = true;
    const card =
      this.cardContainer.nativeElement.querySelector('.profile-card');

    if (card) {
      card.classList.add(`swipe-${direction}`);

      setTimeout(() => {
        // this.nextProfile();
        this.isAnimating = false;
      }, 300);
    }
  }

  // nextProfile() {
  //   this.currentProfileIndex++;
  //   if (this.currentProfileIndex >= this.matchingProfiles.length) {
  //     this.noMoreProfiles = true;
  //   }
  // }

  // getVisibleProfiles(): UserProfile[] {
  //   if (window.innerWidth <= 768) {
  //     // Mobile: show only current and next profile
  //     const profiles = [];
  //     const current = this.getCurrentProfile();
  //     const next = this.getNextProfile();

  //     if (current) profiles.push(current);
  //     if (next) profiles.push(next);

  //     return profiles;
  //   } else {
  //     // Desktop/Tablet: show multiple profiles (up to 6)
  //     return this.matchingProfiles.slice(0, 6);
  //   }
  // }

  reloadProfiles() {
    // this.loadMatchingProfiles();
  }

  // openProfile(profile: UserProfile) {
  //   // Navigate to detailed profile view
  //   console.log('Opening profile:', profile.nome);
  //   // Here you would typically navigate to a detailed profile component
  // }
}
