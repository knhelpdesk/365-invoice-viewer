-- Initialize database for Office 365 Invoice Viewer
-- This script runs automatically when the PostgreSQL container starts

-- Create the main database (if not exists)
-- Note: The database is already created via POSTGRES_DB environment variable

-- Sessions table for user session management
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log table for tracking invoice access
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cached tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(255) PRIMARY KEY,
    display_name VARCHAR(500) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cached invoices table (optional - for performance)
CREATE TABLE IF NOT EXISTS cached_invoices (
    id VARCHAR(255) PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,
    tenant_name VARCHAR(500) NOT NULL,
    download_url TEXT,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);
CREATE INDEX IF NOT EXISTS idx_cached_invoices_tenant_id ON cached_invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cached_invoices_date ON cached_invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_cached_invoices_expires_at ON cached_invoices(expires_at);

-- Insert some sample tenants for testing
INSERT INTO tenants (id, display_name, domain) VALUES 
    ('tenant-1', 'Contoso Corporation', 'contoso.onmicrosoft.com'),
    ('tenant-2', 'Fabrikam Inc.', 'fabrikam.onmicrosoft.com'),
    ('tenant-3', 'Adventure Works', 'adventureworks.onmicrosoft.com')
ON CONFLICT (id) DO NOTHING;

-- Function to clean up expired cached invoices
CREATE OR REPLACE FUNCTION cleanup_expired_invoices()
RETURNS void AS $$
BEGIN
    DELETE FROM cached_invoices WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (if needed for specific user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO invoice_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO invoice_user;