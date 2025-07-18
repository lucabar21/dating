import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Sidebar } from '../../components/sidebar/sidebar';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { WelcomeModal } from '../../components/welcome-modal/welcome-modal';
import { Footer } from '../../components/footer/footer';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Sidebar, BottomNav,WelcomeModal, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  isMobile: boolean = false;
  private breakpointObserver = inject(BreakpointObserver);
  showWelcomeModal: boolean = false;
/*
  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
       this.checkFirstAccess();
  }*/
//soluzione forzata per il problema del breakpointObserver che non funzionava da 600 a 960
  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

       this.checkFirstAccess();
  }

  // 🔥 METODO PER CONTROLLARE PRIMO ACCESSO (aggiungi)
  private checkFirstAccess(): void {
    const primoAccesso = localStorage.getItem('primo_accesso') === 'true';
    const nonMostrareModal = localStorage.getItem('non_mostrare_modal') === 'true';

    if (primoAccesso && !nonMostrareModal) {
      // Piccolo delay per far caricare la dashboard
      setTimeout(() => {
        this.showWelcomeModal = true;
      }, 500);
    }
  }

  // 🔥 METODO PER CHIUDERE MODAL (aggiungi)
  onCloseWelcomeModal(): void {
    this.showWelcomeModal = false;
  }
}
