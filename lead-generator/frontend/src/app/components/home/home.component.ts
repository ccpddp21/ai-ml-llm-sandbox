import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService, ThemeConfig } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  theme: ThemeConfig;

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {
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

  navigateToAddLead(): void {
    this.router.navigate(['/add-lead']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
