import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-matches',
  imports: [CommonModule, RouterModule],
  templateUrl: './matches.html',
  styleUrl: './matches.css',
})
export class Matches {
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
}
