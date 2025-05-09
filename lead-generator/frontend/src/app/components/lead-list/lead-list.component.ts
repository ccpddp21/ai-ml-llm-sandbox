import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lead } from '../../models/lead.model';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss']
})
export class LeadListComponent implements OnInit {
  leads: Lead[] = [];
  filteredLeads: Lead[] = [];
  isLoading = true;
  error = '';
  
  // Filtering
  searchTerm = '';
  filterScore = 0;
  
  // Sorting
  sortField = 'createdAt';
  sortDirection = 'desc';

  constructor(
    private leadService: LeadService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLeads();
  }
  
  loadLeads(): void {
    this.isLoading = true;
    this.error = '';
    
    this.leadService.getAllLeads().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.leads = response.data;
          this.applyFilters();
        } else {
          this.error = 'Failed to load leads data';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while loading leads';
        this.isLoading = false;
      }
    });
  }
  
  applyFilters(): void {
    // First filter by search term
    let filtered = this.leads;
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        (lead.name && lead.name.toLowerCase().includes(term)) ||
        (lead.email && lead.email.toLowerCase().includes(term)) ||
        (lead.company && lead.company.toLowerCase().includes(term)) ||
        (lead.industry && lead.industry.toLowerCase().includes(term))
      );
    }
    
    // Then filter by qualification score
    if (this.filterScore > 0) {
      filtered = filtered.filter(lead => {
        const scoreStr = lead.qualificationScore !== undefined ? String(lead.qualificationScore) : '0';
        const score = parseInt(scoreStr, 10);
        return score >= this.filterScore;
      });
    }
    
    // Apply sorting
    filtered = this.sortLeads(filtered);
    
    this.filteredLeads = filtered;
  }
  
  sortLeads(leads: Lead[]): Lead[] {
    return leads.sort((a, b) => {
      let valueA = a[this.sortField as keyof Lead] || '';
      let valueB = b[this.sortField as keyof Lead] || '';
      
      // Handle numeric values
      if (this.sortField === 'qualificationScore') {
        valueA = parseInt(valueA as string, 10) || 0;
        valueB = parseInt(valueB as string, 10) || 0;
      }
      
      // Handle date values
      if (this.sortField === 'createdAt') {
        valueA = new Date(valueA as string).getTime() || 0;
        valueB = new Date(valueB as string).getTime() || 0;
      }
      
      // Compare based on direction
      if (this.sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }
  
  onSearch(): void {
    this.applyFilters();
  }
  
  onFilterScoreChange(score: number): void {
    this.filterScore = score;
    this.applyFilters();
  }
  
  onSort(field: string): void {
    // If clicking the same field, toggle direction
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc'; // Default to desc for new field
    }
    
    this.applyFilters();
  }
  
  viewLead(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/leads', id]);
    }
  }
  
  exportLeads(): void {
    this.leadService.exportLeadsToCSV().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (error) => {
        this.error = error.message || 'Failed to export leads';
      }
    });
  }
  
  // Helper method to get score class based on value
  getScoreClass(score: number | undefined): string {
    if (!score) return 'low-score';
    if (score >= 80) return 'high-score';
    if (score >= 60) return 'medium-score';
    return 'low-score';
  }
}
