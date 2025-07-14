import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user = {
    id: 1,
    name: 'Nome Utente',
    email: 'email@email.com',
    gender: 'Donna',
    birthDate: new Date('1990-01-01'),
    bio: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
    interests: ['Sport', 'Musica', 'Viaggi'],
    location: 'Città, Paese',
    profilePicture:
      'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg',
    accountType: 'STANDARD',
    registrationDate: new Date('2023-01-01'),
  };

  // Metodo per ricavare l'età dell'utente  a partire dalla data di nascita
  getAge(): number {
    const today = new Date();
    const birthDate = this.user.birthDate;
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  constructor() {}
}
