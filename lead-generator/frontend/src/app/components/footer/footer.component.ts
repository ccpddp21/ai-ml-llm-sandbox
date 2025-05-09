import { Component, OnInit } from '@angular/core';
import { ThemeService, ThemeConfig } from '../../services/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  theme: ThemeConfig;
  currentYear: number = new Date().getFullYear();

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
}
