const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Client } = require('@azure/msal-node');
const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/invoice_viewer',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, 'public')));

// Microsoft Graph API configuration
const msalConfig = {
  auth: {
    clientId: process.env.VITE_CLIENT_ID,
    clientSecret: process.env.VITE_CLIENT_SECRET,
    authority: `https://login.microsoftonline.com/${process.env.VITE_TENANT_ID || 'organizations'}`
  }
};

const cca = new Client(msalConfig);

// Middleware to verify access token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];
  req.accessToken = token;
  next();
};

// Helper function to make Graph API calls
const callGraphAPI = async (endpoint, accessToken) => {
  try {
    const response = await axios.get(`https://graph.microsoft.com/v1.0${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Graph API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Get available tenants
app.get('/api/tenants', verifyToken, async (req, res) => {
  try {
    // Fetch tenants from database
    const result = await pool.query('SELECT id, display_name as "displayName", domain FROM tenants ORDER BY display_name');
    const tenants = result.rows;

    res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// Get invoices
app.get('/api/invoices', verifyToken, async (req, res) => {
  try {
    const { tenant, dateFrom, dateTo, minAmount, maxAmount, invoiceNumber } = req.query;
    
    // Log the request for audit purposes
    try {
      await pool.query(
        'INSERT INTO audit_logs (user_id, tenant_id, action, resource_type, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)',
        ['user-from-token', tenant || 'all', 'VIEW_INVOICES', 'invoices', req.ip, req.get('User-Agent')]
      );
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    // In a real implementation, you would call Microsoft Graph API or billing APIs
    // For demo purposes, we'll return mock invoice data
    const mockInvoices = [
      {
        id: 'inv-001',
        invoiceNumber: '2024-001',
        invoiceDate: '2024-01-15',
        dueDate: '2024-02-15',
        totalAmount: 1250.00,
        currency: 'USD',
        status: 'paid',
        tenantId: 'tenant-1',
        tenantName: 'Contoso Corporation'
      },
      {
        id: 'inv-002',
        invoiceNumber: '2024-002',
        invoiceDate: '2024-01-20',
        dueDate: '2024-02-20',
        totalAmount: 890.50,
        currency: 'USD',
        status: 'pending',
        tenantId: 'tenant-2',
        tenantName: 'Fabrikam Inc.'
      },
      {
        id: 'inv-003',
        invoiceNumber: '2024-003',
        invoiceDate: '2024-01-25',
        dueDate: '2024-02-25',
        totalAmount: 2100.75,
        currency: 'USD',
        status: 'paid',
        tenantId: 'tenant-3',
        tenantName: 'Adventure Works'
      },
      {
        id: 'inv-004',
        invoiceNumber: '2024-004',
        invoiceDate: '2024-02-01',
        dueDate: '2024-03-01',
        totalAmount: 675.25,
        currency: 'USD',
        status: 'overdue',
        tenantId: 'tenant-1',
        tenantName: 'Contoso Corporation'
      },
      {
        id: 'inv-005',
        invoiceNumber: '2024-005',
        invoiceDate: '2024-02-10',
        dueDate: '2024-03-10',
        totalAmount: 1500.00,
        currency: 'USD',
        status: 'pending',
        tenantId: 'tenant-2',
        tenantName: 'Fabrikam Inc.'
      }
    ];

    let filteredInvoices = mockInvoices;

    // Apply filters
    if (tenant && tenant !== 'all') {
      filteredInvoices = filteredInvoices.filter(invoice => invoice.tenantId === tenant);
    }

    if (dateFrom) {
      filteredInvoices = filteredInvoices.filter(invoice => 
        new Date(invoice.invoiceDate) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filteredInvoices = filteredInvoices.filter(invoice => 
        new Date(invoice.invoiceDate) <= new Date(dateTo)
      );
    }

    if (minAmount) {
      filteredInvoices = filteredInvoices.filter(invoice => 
        invoice.totalAmount >= parseFloat(minAmount)
      );
    }

    if (maxAmount) {
      filteredInvoices = filteredInvoices.filter(invoice => 
        invoice.totalAmount <= parseFloat(maxAmount)
      );
    }

    if (invoiceNumber) {
      filteredInvoices = filteredInvoices.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(invoiceNumber.toLowerCase())
      );
    }

    res.json(filteredInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Download invoice
app.get('/api/invoices/:id/download', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, you would fetch the actual invoice file
    // For demo purposes, we'll return a mock PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${id}.pdf"`);
    
    // Mock PDF content (in reality, you'd fetch from Microsoft APIs or generate)
    const mockPdfContent = Buffer.from('%PDF-1.4 Mock Invoice PDF Content');
    res.send(mockPdfContent);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ error: 'Failed to download invoice' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  // For API routes, return JSON error
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({ error: 'API route not found' });
  } else {
    // For all other routes, serve the React app
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;