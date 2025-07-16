import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './welcome-modal.html',
  styleUrls: ['./welcome-modal.css'],
})
export class WelcomeModal {
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  nonMostrareModal: boolean = false;

  onCloseModal(): void {
    if (this.nonMostrareModal) {
      localStorage.setItem('non_mostrare_modal', 'true');
    }
    this.closeModal.emit();
  }
}
