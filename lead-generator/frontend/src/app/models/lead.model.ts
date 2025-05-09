export interface Lead {
  id?: string;
  name: string;
  email: string;
  company: string;
  position: string;
  industry: string;
  companySize: string;
  phone?: string;
  message?: string;
  qualificationScore?: number;
  aiInsights?: string;
  createdAt?: string;
}
