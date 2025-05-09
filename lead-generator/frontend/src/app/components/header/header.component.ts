import { Component, OnInit } from '@angular/core';
import { ThemeService, ThemeConfig } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  theme: ThemeConfig;
  isMenuOpen = false;

  constructor(private themeService: ThemeService) {
    this.theme = {
      primaryColor: '#4a6bff',
      primaryLight: '#e8edff',
      secondaryColor: '#34d399',
      companyName: 'LeadLift'
    };
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
