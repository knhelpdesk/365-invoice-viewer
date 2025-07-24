import React from 'react';
import { Search, Calendar, DollarSign, Hash } from 'lucide-react';
import { SearchFilters } from '../types';

interface InvoiceSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export const InvoiceSearch: React.FC<InvoiceSearchProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900">Search Filters</h3>
        </div>
        {Object.keys(filters).length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <Hash className="inline h-3 w-3 mr-1" />
            Invoice Number
          </label>
          <input
            type="text"
            value={filters.invoiceNumber || ''}
            onChange={(e) => handleFilterChange('invoiceNumber', e.target.value)}
            placeholder="Search by number..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <Calendar className="inline h-3 w-3 mr-1" />
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <DollarSign className="inline h-3 w-3 mr-1" />
              Min Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={filters.minAmount || ''}
              onChange={(e) => handleFilterChange('minAmount', parseFloat(e.target.value))}
              placeholder="0.00"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Max Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={filters.maxAmount || ''}
              onChange={(e) => handleFilterChange('maxAmount', parseFloat(e.target.value))}
              placeholder="0.00"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};