import React from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { LoginForm } from './components/LoginForm';
import { InvoiceViewer } from './components/InvoiceViewer';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID || 'your-client-id',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID || 'organizations'}`,
    redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedTemplate>
          <InvoiceViewer />
        </AuthenticatedTemplate>
        
        <UnauthenticatedTemplate>
          <LoginForm />
        </UnauthenticatedTemplate>
      </div>
    </MsalProvider>
  );
}

export default App;