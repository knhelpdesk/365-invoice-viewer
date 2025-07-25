export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  tenantId: string;
  tenantName: string;
  downloadUrl?: string;
}

export interface Tenant {
  id: string;
  displayName: string;
  domain: string;
}

export interface SearchFilters {
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  invoiceNumber?: string;
}