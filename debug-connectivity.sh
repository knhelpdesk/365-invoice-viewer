#!/bin/bash

echo "=== Docker Container Status ==="
docker-compose ps

echo ""
echo "=== App Container Logs (last 20 lines) ==="
docker-compose logs --tail=20 app

echo ""
echo "=== Nginx Container Logs (last 10 lines) ==="
docker-compose logs --tail=10 nginx

echo ""
echo "=== Testing App Container Health ==="
docker-compose exec app curl -f http://localhost:3001/health || echo "❌ App health check failed"

echo ""
echo "=== Testing App from Nginx Container ==="
docker-compose exec nginx wget -qO- http://app:3001/health || echo "❌ Nginx cannot reach app"

echo ""
echo "=== Network Connectivity Test ==="
docker-compose exec nginx nslookup app || echo "❌ DNS resolution failed"

echo ""
echo "=== Port Listening Check ==="
docker-compose exec app netstat -tlnp | grep :3001 || echo "❌ App not listening on 3001"

echo ""
echo "=== Direct curl test from host ==="
curl -f http://localhost:3001/health || echo "❌ Cannot reach app from host"