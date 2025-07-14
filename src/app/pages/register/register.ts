import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule], 
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

myform = new FormGroup({
  id: new FormControl(null), // opzionale, può essere gestito lato backend
  nome: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  cognome: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  genere: new FormControl('', [Validators.required]),
  dataNascita: new FormControl('', [Validators.required]),
  posizione: new FormControl('', [Validators.required]),

  // valori dati da default
  bio: new FormControl(''),
  interessi: new FormControl([]),
  fotoProfilo: new FormControl(''), // es. URL placeholder o vuoto
  tipoAccount: new FormControl('STANDARD'), // oppure 'PREMIUM' in base a logica app
  dataRegistrazione: new FormControl(new Date())
});



  registra() {
    if (this.myform.valid) {
      alert('Elenco valori: '+
        'Nome: ' + this.myform.get('nome')?.value + ', ' +
        'Cognome: ' + this.myform.get('cognome')?.value + ', ' +
        'Email: ' + this.myform.get('email')?.value + ', ' +
        'Anni: ' + this.myform.get('anni')?.value + ', ' +
        'Rating: ' + this.myform.get('rating')?.value);

    } else {
      console.log('Form is invalid');
    }
  }

}
