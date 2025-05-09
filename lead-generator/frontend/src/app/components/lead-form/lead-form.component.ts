import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Lead } from '../../models/lead.model';
import { LeadService } from '../../services/lead.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss']
})
export class LeadFormComponent implements OnInit {
  leadForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  submitSuccess = false;
  
  // Industry options
  industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing',
    'Retail', 'Real Estate', 'Marketing', 'Consulting', 'Entertainment',
    'Transportation', 'Energy', 'Agriculture', 'Construction', 'Other'
  ];
  
  // Company size options
  companySizes = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  ];

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.leadForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      company: ['', [Validators.required]],
      position: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      companySize: ['', [Validators.required]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],
      message: ['']
    });
  }

  ngOnInit(): void {
    // Initialize any additional setup if needed
  }

  // Getter for easy access to form fields
  get f() { 
    return this.leadForm.controls; 
  }

  onSubmit(): void {
    // Reset states
    this.submitError = '';
    this.submitSuccess = false;
    
    // Check if form is valid
    if (this.leadForm.invalid) {
      this.markFormGroupTouched(this.leadForm);
      return;
    }
    
    // Set submitting state
    this.isSubmitting = true;
    
    // Create lead object from form values
    const leadData: Lead = this.leadForm.value;
    
    // Submit to API
    this.leadService.createLead(leadData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        
        // Reset form
        this.leadForm.reset();
        
        // Navigate to lead detail or list after a delay
        setTimeout(() => {
          this.router.navigate(['/leads']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = error.message || 'Failed to submit lead. Please try again.';
      }
    });
  }

  // Helper method to mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
