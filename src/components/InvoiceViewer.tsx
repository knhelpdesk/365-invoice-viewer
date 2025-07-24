import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { InvoiceList } from './InvoiceList';
import { InvoiceSearch } from './InvoiceSearch';
import { TenantSelector } from './TenantSelector';
import { Header } from './Header';
import { Invoice, SearchFilters, Tenant } from '../types';

export const InvoiceViewer: React.FC = () => {
  const { accounts, instance } = useMsal();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTenants();
  }, []);

  useEffect(() => {
    if (tenants.length > 0) {
      loadInvoices();
    }
  }, [selectedTenant, searchFilters, tenants]);

  const getAccessToken = async () => {
    const request = {
      scopes: ['https://graph.microsoft.com/.default'],
      account: accounts[0],
    };

    try {
      const response = await instance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      const response = await instance.acquireTokenPopup(request);
      return response.accessToken;
    }
  };

  const loadTenants = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch('http://localhost:3001/api/tenants', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to load tenants');
      
      const tenantsData = await response.json();
      setTenants(tenantsData);
    } catch (err) {
      setError('Failed to load tenants. Please check your connection.');
      console.error('Error loading tenants:', err);
    }
  };

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getAccessToken();
      const params = new URLSearchParams();
      if (selectedTenant !== 'all') params.append('tenant', selectedTenant);
      if (searchFilters.dateFrom) params.append('dateFrom', searchFilters.dateFrom);
      if (searchFilters.dateTo) params.append('dateTo', searchFilters.dateTo);
      if (searchFilters.minAmount) params.append('minAmount', searchFilters.minAmount.toString());
      if (searchFilters.maxAmount) params.append('maxAmount', searchFilters.maxAmount.toString());
      if (searchFilters.invoiceNumber) params.append('invoiceNumber', searchFilters.invoiceNumber);

      const response = await fetch(`http://localhost:3001/api/invoices?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to load invoices');

      const invoicesData = await response.json();
      setInvoices(invoicesData);
    } catch (err) {
      setError('Failed to load invoices. Please try again.');
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`http://localhost:3001/api/invoices/${invoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to download invoice');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      setError('Failed to download invoice. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <TenantSelector
                tenants={tenants}
                selectedTenant={selectedTenant}
                onTenantChange={setSelectedTenant}
              />
              
              <div className="mt-6">
                <InvoiceSearch
                  filters={searchFilters}
                  onFiltersChange={setSearchFilters}
                />
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <InvoiceList
                invoices={invoices}
                loading={loading}
                error={error}
                onDownload={handleDownloadInvoice}
                onRefresh={loadInvoices}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};