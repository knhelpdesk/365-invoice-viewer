# Office 365 Invoice Viewer App (Dockerized)

A lightweight web application that allows users to log in using Office 365 credentials and view/download Microsoft 365 invoices from multiple tenants in one place.

## 🚀 Features

- ✅ **Office 365 Authentication**: Secure OAuth2 login using Microsoft Identity Platform
- ✅ **Multi-tenant Support**: View invoices across multiple Microsoft 365 tenants
- ✅ **Advanced Search**: Filter by date range, amount, invoice number, and tenant
- ✅ **Invoice Management**: View, search, and download invoices with ease
- ✅ **Modern UI**: Responsive design with Microsoft design language
- ✅ **Dockerized**: Complete containerization with PostgreSQL database
- ✅ **Security**: Rate limiting, audit logging, and secure token handling
- ✅ **Production Ready**: Health monitoring, error handling, and logging

## 📋 Prerequisites

- Docker and Docker Compose installed
- Microsoft Azure AD application registration
- Node.js 18+ (for local development only)

## 🔧 Azure AD Application Setup

1. **Go to Azure Portal**: Navigate to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations

2. **Create New Registration**:
   - **Name**: "Office 365 Invoice Viewer"
   - **Supported account types**: "Accounts in any organizational directory (Any Azure AD directory - Multitenant)"
   - **Redirect URI**: 
     - Type: Single-page application (SPA)
     - URI: `http://localhost` (for Docker) or `http://localhost:5173` (for development)

3. **Note Important Values**:
   - Application (client) ID
   - Directory (tenant) ID

4. **Create Client Secret**:
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Add description and set expiration
   - **Copy the secret value immediately** (it won't be shown again)

5. **Configure API Permissions**:
   - Go to "API permissions"
   - Add the following Microsoft Graph permissions:
     - `User.Read` (Delegated) - Read user profile
     - `Directory.Read.All` (Application) - Read directory data
     - `Organization.Read.All` (Application) - Read organization info
   - Click "Grant admin consent" for your organization

## 🚀 Quick Start with Docker

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/office365-invoice-viewer.git
cd office365-invoice-viewer
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your Azure AD credentials:
```env
# Microsoft Azure AD Configuration
VITE_CLIENT_ID=your-azure-client-id-here
VITE_CLIENT_SECRET=your-azure-client-secret-here
VITE_TENANT_ID=your-azure-tenant-id-here
VITE_REDIRECT_URI=http://localhost

# Backend Configuration
NODE_ENV=production
PORT=3001
SESSION_SECRET=your-secure-random-session-secret-here

# Database Configuration
DATABASE_URL=postgresql://postgres:password@db:5432/invoice_viewer
```

### 3. Start the Application
```bash
docker-compose up -d
```

### 4. Access the Application
- **Application**: http://localhost
- **API Health Check**: http://localhost:3001/health
- **Database**: localhost:5432 (if you need direct access)

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL (or use Docker for database only)

### Setup
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Start PostgreSQL with Docker (optional)
docker-compose up -d db

# Update .env for development
VITE_REDIRECT_URI=http://localhost:5173
DATABASE_URL=postgresql://postgres:password@localhost:5432/invoice_viewer
```

### Run Development Servers
```bash
# Terminal 1: Frontend (Vite dev server)
npm run dev

# Terminal 2: Backend (Express server)
cd server
npm run dev
```

Access the application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 📁 Project Structure

```
office365-invoice-viewer/
├── src/                          # React frontend source code
│   ├── components/               # React components
│   │   ├── LoginForm.tsx        # OAuth2 login component
│   │   ├── Header.tsx           # Application header
│   │   ├── InvoiceViewer.tsx    # Main invoice viewer
│   │   ├── InvoiceList.tsx      # Invoice list display
│   │   ├── InvoiceSearch.tsx    # Search and filters
│   │   └── TenantSelector.tsx   # Tenant selection
│   ├── types/                   # TypeScript definitions
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── server/                      # Node.js backend
│   ├── index.js                 # Express server
│   └── package.json             # Backend dependencies
├── database/                    # Database initialization
│   └── init.sql                 # PostgreSQL schema
├── docker-compose.yml           # Multi-container orchestration
├── Dockerfile                   # Application container
├── nginx.conf                   # Reverse proxy configuration
├── .env.example                 # Environment variables template
├── .dockerignore               # Docker ignore rules
└── README.md                   # This documentation
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/tenants` | Fetch available tenants | Required |
| `GET` | `/api/invoices` | Fetch invoices with filtering | Required |
| `GET` | `/api/invoices/:id/download` | Download specific invoice | Required |
| `GET` | `/health` | Health check endpoint | None |

### Query Parameters for `/api/invoices`
- `tenant` - Filter by tenant ID (or 'all' for all tenants)
- `dateFrom` - Start date filter (YYYY-MM-DD)
- `dateTo` - End date filter (YYYY-MM-DD)
- `minAmount` - Minimum amount filter
- `maxAmount` - Maximum amount filter
- `invoiceNumber` - Invoice number search

## 🐳 Docker Commands

### Basic Operations
```bash
# Start all services
docker-compose up -d

# View service status
docker-compose ps

# View logs
docker-compose logs -f app
docker-compose logs -f db

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose down && docker-compose up -d --build
```

### Database Operations
```bash
# Access database directly
docker-compose exec db psql -U postgres -d invoice_viewer

# Create database backup
docker-compose exec db pg_dump -U postgres invoice_viewer > backup.sql

# Restore database from backup
docker-compose exec -T db psql -U postgres invoice_viewer < backup.sql

# View database logs
docker-compose logs -f db
```

### Troubleshooting
```bash
# View all container logs
docker-compose logs

# Restart specific service
docker-compose restart app

# Remove all containers and volumes (CAUTION: This deletes data)
docker-compose down -v

# Check container resource usage
docker stats
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable CORS origins
- **Token Validation**: Proper OAuth2 token verification
- **Audit Logging**: All user actions are logged to database
- **Input Validation**: Request validation and sanitization
- **Session Management**: Secure session handling

## 📊 Database Schema

### Tables
- **sessions**: User session management and token storage
- **audit_logs**: User action tracking and security auditing
- **tenants**: Cached tenant information for performance
- **cached_invoices**: Optional invoice caching (for future use)

### Sample Queries
```sql
-- View recent user activity
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;

-- Check active sessions
SELECT user_id, tenant_id, created_at FROM sessions WHERE expires_at > NOW();

-- View available tenants
SELECT display_name, domain FROM tenants ORDER BY display_name;
```

## 🌐 Production Deployment

### 1. Update Environment Variables
```env
NODE_ENV=production
VITE_REDIRECT_URI=https://yourdomain.com
DATABASE_URL=postgresql://username:password@your-db-host:5432/invoice_viewer
```

### 2. Enable HTTPS (Optional)
Uncomment the HTTPS section in `nginx.conf` and add SSL certificates to `./ssl/` directory.

### 3. Deploy
```bash
docker-compose -f docker-compose.yml up -d
```

### 4. Health Monitoring
- Health endpoint: `https://yourdomain.com/health`
- Monitor logs: `docker-compose logs -f`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_CLIENT_ID` | Azure AD Application ID | ✅ | - |
| `VITE_CLIENT_SECRET` | Azure AD Client Secret | ✅ | - |
| `VITE_TENANT_ID` | Azure AD Tenant ID | ✅ | - |
| `VITE_REDIRECT_URI` | OAuth2 Redirect URI | ✅ | - |
| `SESSION_SECRET` | Session encryption key | ✅ | - |
| `DATABASE_URL` | PostgreSQL connection string | ✅ | - |
| `NODE_ENV` | Environment mode | ❌ | `development` |
| `PORT` | Server port | ❌ | `3001` |

### Customization
- **UI Theme**: Modify Tailwind classes in components
- **Database**: Update `database/init.sql` for schema changes
- **API**: Extend `server/index.js` for additional endpoints
- **Authentication**: Modify MSAL configuration in `src/App.tsx`

## 🐛 Troubleshooting

### Common Issues

#### Authentication Fails
- ✅ Verify Azure AD app registration settings
- ✅ Check redirect URI matches exactly (including protocol)
- ✅ Ensure API permissions are granted and admin consent given
- ✅ Verify client secret hasn't expired

#### Database Connection Issues
- ✅ Check DATABASE_URL format is correct
- ✅ Ensure PostgreSQL container is running: `docker-compose ps`
- ✅ Review database logs: `docker-compose logs db`
- ✅ Verify network connectivity between containers

#### CORS Errors
- ✅ Update CORS origins in `server/index.js`
- ✅ Verify frontend and backend URLs match environment
- ✅ Check browser developer tools for specific CORS errors

#### Container Issues
- ✅ Ensure Docker and Docker Compose are installed and running
- ✅ Check available disk space and memory
- ✅ Review container logs: `docker-compose logs [service-name]`
- ✅ Try rebuilding containers: `docker-compose up -d --build`

### Debug Mode
Enable debug logging by setting environment variables:
```env
DEBUG=*
NODE_ENV=development
```

## 📈 Monitoring and Logging

### Application Logs
```bash
# View real-time application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f db

# View nginx logs (if using)
docker-compose logs -f nginx
```

### Health Checks
- **Application Health**: `GET /health`
- **Database Health**: Automatic connection testing on startup
- **Container Health**: Docker health checks configured

### Metrics
- Request rate limiting metrics
- Database connection pool status
- User authentication success/failure rates
- Invoice access patterns

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** if applicable
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR
- Ensure Docker containers build successfully

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and community support
- **Documentation**: Check this README and inline code comments

### Useful Resources
- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [React Documentation](https://reactjs.org/docs/)

## 🎯 Roadmap

### Planned Features
- [ ] Real Microsoft Graph API integration for actual invoice data
- [ ] Advanced reporting and analytics
- [ ] Email notifications for new invoices
- [ ] Export functionality (CSV, Excel)
- [ ] Multi-language support
- [ ] Advanced user role management
- [ ] API rate limiting per user
- [ ] Webhook support for real-time updates

### Known Limitations
- Currently uses mock invoice data (ready for Graph API integration)
- Single-region deployment (can be extended for multi-region)
- Basic audit logging (can be enhanced with more detailed tracking)

---

**Made with ❤️ for Microsoft 365 administrators and billing teams**

For questions or support, please create an issue on GitHub.