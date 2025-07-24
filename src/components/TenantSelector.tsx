import React from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { Tenant } from '../types';

interface TenantSelectorProps {
  tenants: Tenant[];
  selectedTenant: string;
  onTenantChange: (tenantId: string) => void;
}

export const TenantSelector: React.FC<TenantSelectorProps> = ({
  tenants,
  selectedTenant,
  onTenantChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Building2 className="h-5 w-5 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-900">Select Tenant</h3>
      </div>
      
      <div className="relative">
        <select
          value={selectedTenant}
          onChange={(e) => onTenantChange(e.target.value)}
          className="w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
        >
          <option value="all">All Tenants</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.displayName}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        {tenants.length} tenant{tenants.length !== 1 ? 's' : ''} available
      </div>
    </div>
  );
};