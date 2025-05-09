import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lead } from '../models/lead.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private apiUrl = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) { }

  // Create a new lead
  createLead(lead: Lead): Observable<any> {
    return this.http.post<any>(this.apiUrl, lead);
  }

  // Get all leads
  getAllLeads(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Get a specific lead by ID
  getLeadById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Get qualified leads based on minimum score
  getQualifiedLeads(minScore: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/qualified/${minScore}`);
  }

  // Export leads as CSV
  exportLeadsToCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/csv`, {
      responseType: 'blob'
    });
  }
}
