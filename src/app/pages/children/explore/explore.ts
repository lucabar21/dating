import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UserProfile {
  id: string;
  nome: string;
  eta: number;
  bio: string;
  foto: string;
  distanza: number;
  interessi: string[];
  professione?: string;
  ultimaAttivita?: string;
}

interface CurrentUser {
  id: string;
  nome: string;
  eta: number;
  genere: 'MASCHIO' | 'FEMMINA';
  interessi: string[];
  posizione: {
    lat: number;
    lng: number;
  };
  preferences: {
    generePreferito: 'MASCHIO' | 'FEMMINA' | null;
    minEta: number;
    maxEta: number;
    distanzaMax: number;
  };
}


@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class Explore implements OnInit {

  @ViewChild('cardContainer') cardContainer!: ElementRef;

  currentUser: CurrentUser = {
    id: 'user1',
    nome: 'Alex Rossi',
    eta: 28,
    genere: 'MASCHIO',
    interessi: ['sport', 'musica', 'viaggi', 'cucina', 'lettura'],
    posizione: { lat: 40.7128, lng: -74.0060 }, // New York
    preferences: {
      generePreferito: 'FEMMINA',
      minEta: 22,
      maxEta: 35,
      distanzaMax: 25
    }
  };

  // Mock data for potential matches
  allProfiles: UserProfile[] = [
    {
      id: 'user2',
      nome: 'Jessie Hughes',
      eta: 25,
      bio: 'I love any movie where they spontaneously break out into song, can only eat three pieces of pizza (every time i go for four i regret it), and probably work too much!',
      foto: 'https://images.unsplash.com/photo-1494790108755-2616c82e8c27?w=400&h=600&fit=crop',
      distanza: 4.2,
      interessi: ['musica', 'cinema', 'cucina', 'arte'],
      professione: 'Artist',
      ultimaAttivita: 'Online now'
    },
    {
      id: 'user3',
      nome: 'Sarah Johnson',
      eta: 29,
      bio: 'Adventure seeker, coffee enthusiast, and dog lover. Always up for trying new restaurants!',
      foto: 'https://images.unsplash.com/photo-1488207774890-902b62e54213?w=400&h=600&fit=crop',
      distanza: 7.8,
      interessi: ['viaggi', 'sport', 'cucina', 'natura'],
      professione: 'Marketing Manager',
      ultimaAttivita: 'Active 2 hours ago'
    },
    {
      id: 'user4',
      nome: 'Emma Wilson',
      eta: 26,
      bio: 'Yoga instructor by day, bookworm by night. Love hiking and exploring new places.',
      foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
      distanza: 12.5,
      interessi: ['sport', 'lettura', 'natura', 'wellness'],
      professione: 'Yoga Instructor',
      ultimaAttivita: 'Active 1 day ago'
    },
    {
      id: 'user5',
      nome: 'Maria Garcia',
      eta: 27,
      bio: 'Chef with a passion for travel and good wine. Always looking for new culinary adventures!',
      foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
      distanza: 3.1,
      interessi: ['cucina', 'viaggi', 'vino', 'arte'],
      professione: 'Chef',
      ultimaAttivita: 'Online now'
    },
    {
      id: 'user6',
      nome: 'Lisa Chen',
      eta: 24,
      bio: 'Photographer and music lover. Life is too short for bad coffee and boring conversations.',
      foto: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400&h=600&fit=crop',
      distanza: 9.3,
      interessi: ['fotografia', 'musica', 'arte', 'caffè'],
      professione: 'Photographer',
      ultimaAttivita: 'Active 3 hours ago'
    }
  ];

  matchingProfiles: UserProfile[] = [];
  currentProfileIndex = 0;
  isAnimating = false;
  noMoreProfiles = false;

  ngOnInit() {
    this.loadMatchingProfiles();
  }

  loadMatchingProfiles() {
    // Filter profiles based on current user's preferences
    this.matchingProfiles = this.allProfiles.filter(profile => {
      // Check age range
      const ageMatch = profile.eta >= this.currentUser.preferences.minEta && 
                       profile.eta <= this.currentUser.preferences.maxEta;
      
      // Check distance
      const distanceMatch = profile.distanza <= this.currentUser.preferences.distanzaMax;
      
      // Check if there are common interests (at least 1)
      const commonInterests = profile.interessi.filter(interest => 
        this.currentUser.interessi.includes(interest)
      );
      const hasCommonInterests = commonInterests.length > 0;

      return ageMatch && distanceMatch && hasCommonInterests;
    });

    // Sort by compatibility score (more common interests = higher score)
    this.matchingProfiles.sort((a, b) => {
      const scoreA = this.calculateCompatibilityScore(a);
      const scoreB = this.calculateCompatibilityScore(b);
      return scoreB - scoreA;
    });

    this.currentProfileIndex = 0;
    this.noMoreProfiles = this.matchingProfiles.length === 0;
  }

  calculateCompatibilityScore(profile: UserProfile): number {
    // Calculate score based on common interests and proximity
    const commonInterests = profile.interessi.filter(interest => 
      this.currentUser.interessi.includes(interest)
    );
    
    const interestScore = commonInterests.length * 10;
    const distanceScore = Math.max(0, 50 - profile.distanza); // Closer = higher score
    
    return interestScore + distanceScore;
  }

    getCommonInterests(profile: UserProfile): string[] {
      return profile.interessi.filter(interest => 
        this.currentUser.interessi.includes(interest)
      );
    }
    
  getCurrentProfile(): UserProfile | null {
    if (this.currentProfileIndex >= this.matchingProfiles.length) {
      return null;
    }
    return this.matchingProfiles[this.currentProfileIndex];
  }

  getNextProfile(): UserProfile | null {
    const nextIndex = this.currentProfileIndex + 1;
    if (nextIndex >= this.matchingProfiles.length) {
      return null;
    }
    return this.matchingProfiles[nextIndex];
  }

  swipeLeft(profile?: UserProfile) {
    if (this.isAnimating) return;
    
    const targetProfile = profile || this.getCurrentProfile();
    if (!targetProfile) return;
    
    // For mobile: animate the swipe
    if (window.innerWidth <= 768) {
      this.animateSwipe('left');
    } else {
      // For desktop: remove the profile immediately
      this.removeProfile(targetProfile);
    }
    
    console.log('Swiped left on:', targetProfile.nome);
  }

  swipeRight(profile?: UserProfile) {
    if (this.isAnimating) return;
    
    const targetProfile = profile || this.getCurrentProfile();
    if (!targetProfile) return;
    
    // For mobile: animate the swipe
    if (window.innerWidth <= 768) {
      this.animateSwipe('right');
    } else {
      // For desktop: remove the profile immediately
      this.removeProfile(targetProfile);
    }
    
    console.log('Swiped right on:', targetProfile.nome);
  }

  removeProfile(profile: UserProfile) {
    const index = this.matchingProfiles.findIndex(p => p.id === profile.id);
    if (index > -1) {
      this.matchingProfiles.splice(index, 1);
      if (this.matchingProfiles.length === 0) {
        this.noMoreProfiles = true;
      }
    }
  }

  animateSwipe(direction: 'left' | 'right') {
    this.isAnimating = true;
    const card = this.cardContainer.nativeElement.querySelector('.profile-card');
    
    if (card) {
      card.classList.add(`swipe-${direction}`);
      
      setTimeout(() => {
        this.nextProfile();
        this.isAnimating = false;
      }, 300);
    }
  }

  nextProfile() {
    this.currentProfileIndex++;
    if (this.currentProfileIndex >= this.matchingProfiles.length) {
      this.noMoreProfiles = true;
    }
  }

  getVisibleProfiles(): UserProfile[] {
    if (window.innerWidth <= 768) {
      // Mobile: show only current and next profile
      const profiles = [];
      const current = this.getCurrentProfile();
      const next = this.getNextProfile();
      
      if (current) profiles.push(current);
      if (next) profiles.push(next);
      
      return profiles;
    } else {
      // Desktop/Tablet: show multiple profiles (up to 6)
      return this.matchingProfiles.slice(0, 6);
    }
  }

  reloadProfiles() {
    this.loadMatchingProfiles();
  }

  openProfile(profile: UserProfile) {
    // Navigate to detailed profile view
    console.log('Opening profile:', profile.nome);
    // Here you would typically navigate to a detailed profile component
  }
}
