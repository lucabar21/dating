import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeServ } from '../../services/theme-serv';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './welcome-modal.html',
  styleUrls: ['./welcome-modal.css'],
})
export class WelcomeModal implements OnInit, OnDestroy {
   isDarkTheme: boolean = false;
  private themeSub!: Subscription;
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  nonMostrareModal: boolean = false;

  onCloseModal(): void {
    if (this.nonMostrareModal) {
      localStorage.setItem('non_mostrare_modal', 'true');
    }
    this.closeModal.emit();
  }
  constructor(private themeService: ThemeServ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
