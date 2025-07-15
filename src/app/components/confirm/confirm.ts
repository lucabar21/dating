import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './confirm.html',
  styleUrl: './confirm.css'
})
export class Confirm implements OnInit {

  isSuccess: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Leggi parametri URL
    this.route.queryParams.subscribe(params => {
      this.isSuccess = params['success'] === 'true';
      this.isError = params['error'] === 'true';
      this.errorMessage = params['message'] || 'Si è verificato un errore';
    });
  }
}
