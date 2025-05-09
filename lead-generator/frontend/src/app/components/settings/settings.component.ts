import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService, ThemeConfig } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  themeForm: FormGroup;
  currentTheme: ThemeConfig;
  saveSuccess = false;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService
  ) {
    this.currentTheme = {
      primaryColor: '#4a6bff',
      primaryLight: '#e8edff',
      secondaryColor: '#34d399',
      companyName: 'LeadLift'
    };
    
    this.themeForm = this.fb.group({
      companyName: ['LeadLift'],
      primaryColor: ['#4a6bff'],
      primaryLight: ['#e8edff'],
      secondaryColor: ['#34d399'],
      logo: ['']
    });
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
      
      // Update form with current theme values
      this.themeForm.patchValue({
        companyName: theme.companyName || 'LeadLift',
        primaryColor: theme.primaryColor,
        primaryLight: theme.primaryLight,
        secondaryColor: theme.secondaryColor,
        logo: theme.logo || ''
      });
    });
  }

  onSubmit(): void {
    const formValues = this.themeForm.value;
    
    // Create theme config from form values
    const themeConfig: ThemeConfig = {
      primaryColor: formValues.primaryColor,
      primaryLight: formValues.primaryLight,
      secondaryColor: formValues.secondaryColor,
      companyName: formValues.companyName,
      logo: formValues.logo
    };
    
    // Apply the theme
    this.themeService.applyTheme(themeConfig);
    
    // Show success message
    this.saveSuccess = true;
    setTimeout(() => {
      this.saveSuccess = false;
    }, 3000);
  }

  resetToDefault(): void {
    this.themeService.resetToDefault();
    this.saveSuccess = true;
    setTimeout(() => {
      this.saveSuccess = false;
    }, 3000);
  }
}
