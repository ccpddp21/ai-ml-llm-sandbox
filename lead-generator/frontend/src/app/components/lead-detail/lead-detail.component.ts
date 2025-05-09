import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lead } from '../../models/lead.model';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.scss']
})
export class LeadDetailComponent implements OnInit {
  lead: Lead | null = null;
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadLead(id);
      } else {
        this.error = 'Invalid lead ID';
        this.isLoading = false;
      }
    });
  }
  
  loadLead(id: string): void {
    this.isLoading = true;
    this.error = '';
    
    this.leadService.getLeadById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.lead = response.data;
        } else {
          this.error = 'Failed to load lead data';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while loading the lead';
        this.isLoading = false;
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/leads']);
  }
  
  // Helper method to get score class based on value
  getScoreClass(score: number | undefined): string {
    if (!score) return 'low-score';
    
    if (score >= 80) return 'high-score';
    if (score >= 60) return 'medium-score';
    return 'low-score';
  }
  
  // Helper method to get score text based on value
  getScoreText(score: number | undefined): string {
    if (!score) return 'Not Scored';
    
    if (score >= 80) return 'High Quality';
    if (score >= 60) return 'Medium Quality';
    return 'Low Quality';
  }
}
