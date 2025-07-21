import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { ThemeServ } from '../../services/theme-serv';


@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {

  private themeSub!: Subscription;
  isDarkTheme: boolean = false;

  constructor(private themeService: ThemeServ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.theme$.subscribe((theme) => {
      this.isDarkTheme = theme === 'dark';
    });
  }

}
