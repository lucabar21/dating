import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal,
  ɵsetAllowDuplicateNgModuleIdsForTest,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatchServ } from '../../../services/matchServ';

@Component({
  selector: 'app-matches',
  imports: [CommonModule, RouterModule],
  templateUrl: './matches.html',
  styleUrl: './matches.css',
})
export class Matches implements OnInit {
  private matchService = inject(MatchServ);

  matches = signal<any[]>([]);
  /*
  userProfiles = [
    {
      id: 101,
      name: 'Alice',
      profilePicture:
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      age: 25,
      location: 'Roma',
    },
    {
      id: 102,
      name: 'Bob',
      profilePicture:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
      age: 28,
      location: 'Napoli',
    },
    {
      id: 103,
      name: 'Charlie',
      profilePicture:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      age: 30,
      location: 'Milano',
    },
    {
      id: 104,
      name: 'Diana',
      profilePicture:
        'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg',
      age: 27,
      location: 'Torino',
    },
    {
      id: 105,
      name: 'Ethan',
      profilePicture:
        'https://images.pexels.com/photos/26607971/pexels-photo-26607971.jpeg',
      age: 29,
      location: 'Firenze',
    },
  ];
  */

  getMatches() {
    this.matchService.getMatches().subscribe((data: any[]) => {
      console.log('Matches fetched:', data);
      this.matches.set(data);
    });
  }

  ngOnInit() {
    this.getMatches();
  }

  // Metodo per convertire il timestamp del match in quanto tempo è passato da quando è stato creato
  timeAgo(timestamp: string): string {
    const now = new Date().getTime();
    const seconds = Math.floor((now - new Date(timestamp).getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} giorni fa`;
    } else if (hours > 0) {
      return `${hours} ore fa`;
    } else if (minutes > 0) {
      return `${minutes} minuti fa`;
    } else {
      return `${seconds} secondi fa`;
    }
  }
}
