import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LeadLift';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Initialize theme from saved settings
    this.themeService.initializeTheme();
  }
}
