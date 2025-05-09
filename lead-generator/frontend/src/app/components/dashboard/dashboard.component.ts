import { Component, OnInit } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { Lead } from '../../models/lead.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  leadCount = 0;
  qualifiedLeadCount = 0;
  averageScore = 0;
  isLoading = true;
  
  // Make Math available to the template
  Math = Math;
  
  // Placeholder data for charts
  qualificationData = {
    labels: ['High (80-100)', 'Medium (60-79)', 'Low (0-59)'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#34D399', '#4A6BFF', '#F59E0B']
      }
    ]
  };
  
  industryData: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
    }>;
  } = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  constructor(private leadService: LeadService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    
    this.leadService.getAllLeads().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const leads = response.data as Lead[];
          this.leadCount = leads.length;
          
          // Calculate qualified leads (score >= 70)
          const qualifiedLeads = leads.filter((lead: Lead) => {
            const scoreStr = lead.qualificationScore !== undefined ? String(lead.qualificationScore) : '0';
            const score = parseInt(scoreStr, 10);
            return score >= 70;
          });
          this.qualifiedLeadCount = qualifiedLeads.length;
          
          // Calculate average score
          if (leads.length > 0) {
            const totalScore = leads.reduce((sum: number, lead: Lead) => {
              const scoreStr = lead.qualificationScore !== undefined ? String(lead.qualificationScore) : '0';
              const score = parseInt(scoreStr, 10);
              return sum + score;
            }, 0);
            this.averageScore = Math.round(totalScore / leads.length);
          }
          
          // Process qualification score distribution
          const highScoreLeads = leads.filter((lead: Lead) => {
            const scoreStr = lead.qualificationScore !== undefined ? String(lead.qualificationScore) : '0';
            const score = parseInt(scoreStr, 10);
            return score >= 80;
          }).length;
          
          const mediumScoreLeads = leads.filter((lead: Lead) => {
            const scoreStr = lead.qualificationScore !== undefined ? String(lead.qualificationScore) : '0';
            const score = parseInt(scoreStr, 10);
            return score >= 60 && score < 80;
          }).length;
          
          const lowScoreLeads = leads.filter((lead: Lead) => {
            const scoreStr = lead.qualificationScore !== undefined ? String(lead.qualificationScore) : '0';
            const score = parseInt(scoreStr, 10);
            return score < 60;
          }).length;
          
          this.qualificationData.datasets[0].data = [highScoreLeads, mediumScoreLeads, lowScoreLeads];
          
          // Process industry distribution
          const industries: Record<string, number> = {};
          leads.forEach((lead: Lead) => {
            const industry = lead.industry || 'Unknown';
            industries[industry] = (industries[industry] || 0) + 1;
          });
          
          const industryLabels = Object.keys(industries);
          const industryValues = Object.values(industries);
          const industryColors = this.generateColors(industryLabels.length);
          
          this.industryData.labels = industryLabels;
          this.industryData.datasets[0].data = industryValues;
          this.industryData.datasets[0].backgroundColor = industryColors;
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }
  
  // Helper method to generate colors for charts
  generateColors(count: number): string[] {
    const baseColors = ['#4A6BFF', '#34D399', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#10B981', '#6366F1'];
    const colors = [];
    
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    
    return colors;
  }
}
