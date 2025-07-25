import React from 'react';
import { useMsal } from '@azure/msal-react';
import { LoginRequest } from '@azure/msal-browser';
import { Building2, Shield, Users } from 'lucide-react';

const loginRequest: LoginRequest = {
  scopes: ['User.Read', 'Directory.Read.All', 'Organization.Read.All'],
};

export const LoginForm: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Office 365 Invoice Viewer
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access and manage invoices across multiple Microsoft 365 tenants
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Secure OAuth2 Authentication</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Multi-tenant Support</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Building2 className="h-5 w-5 text-purple-500" />
              <span>Invoice Management & Search</span>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            Sign in with Microsoft 365
          </button>

          <div className="text-xs text-gray-500 text-center">
            By signing in, you agree to access your organization's billing information
          </div>
        </div>
      </div>
    </div>
  );
};