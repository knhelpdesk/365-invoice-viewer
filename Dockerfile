# Multi-stage build for frontend and backend

# Frontend build stage
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Backend build stage
FROM node:18-alpine AS backend-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --only=production

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install backend dependencies and copy backend code
COPY --from=backend-build /app/server/node_modules ./node_modules
COPY server/ ./

# Copy frontend build to serve static files
COPY --from=frontend-build /app/client/dist ./public

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the server
CMD ["npm", "start"]