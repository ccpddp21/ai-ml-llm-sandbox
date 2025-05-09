import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeConfig {
  primaryColor: string;
  primaryLight: string;
  secondaryColor: string;
  logo?: string;
  companyName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private defaultTheme: ThemeConfig = {
    primaryColor: '#4a6bff',
    primaryLight: '#e8edff',
    secondaryColor: '#34d399',
    companyName: 'LeadLift'
  };

  private themeSubject = new BehaviorSubject<ThemeConfig>(this.defaultTheme);
  public theme$ = this.themeSubject.asObservable();

  constructor() { }

  initializeTheme(): void {
    // Try to load theme from localStorage
    const savedTheme = localStorage.getItem('leadlift-theme');
    
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        this.applyTheme(parsedTheme);
      } catch (error) {
        console.error('Error parsing saved theme:', error);
        this.applyTheme(this.defaultTheme);
      }
    } else {
      this.applyTheme(this.defaultTheme);
    }
  }

  applyTheme(theme: ThemeConfig): void {
    // Update the observable
    this.themeSubject.next(theme);
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--theme-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--theme-primary-light', theme.primaryLight);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondaryColor);
    
    // Add custom theme class to body
    document.body.classList.add('custom-theme');
    
    // Save to localStorage
    localStorage.setItem('leadlift-theme', JSON.stringify(theme));
  }

  resetToDefault(): void {
    this.applyTheme(this.defaultTheme);
  }
}
