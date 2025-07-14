import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  users = [
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

  chats = [
    {
      id: 1,
      userId: 101,
      lastMessage: 'Ciao! Come stai?',
      timestamp: new Date('2023-10-01T10:00:00'),
    },
    {
      id: 2,
      userId: 102,
      lastMessage: 'Pronto per il nostro incontro?',
      timestamp: new Date('2023-10-02T12:30:00'),
    },
    {
      id: 3,
      userId: 103,
      lastMessage: "Hai visto l'ultimo film?",
      timestamp: new Date('2023-10-03T15:45:00'),
    },
    {
      id: 4,
      userId: 104,
      lastMessage: 'Dove ci vediamo domani?',
      timestamp: new Date('2023-10-04T09:15:00'),
    },
    {
      id: 5,
      userId: 105,
      lastMessage: "Non vedo l'ora di rivederti!",
      timestamp: new Date('2023-10-05T11:20:00'),
    },
  ];

  chatForm = new FormGroup({
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(500),
    ]),
  });

  submitForm() {
    if (this.chatForm.valid) {
      const message = this.chatForm.value.message;
      console.log('Message sent:', message);
      // Here you would typically send the message to the server
      this.chatForm.reset();
    } else {
      console.error('Form is invalid');
    }
  }
}
