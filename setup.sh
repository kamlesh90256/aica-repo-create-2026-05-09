#!/bin/bash

# AICA Local Development Setup Script

echo "🚀 Setting up AICA for local development..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Create .env files if they don't exist
if [ ! -f backend/.env.local ]; then
    echo "📝 Creating backend/.env.local"
    cp backend/.env.local.example backend/.env.local 2>/dev/null || true
fi

if [ ! -f frontend/.env.local ]; then
    echo "📝 Creating frontend/.env.local"
    cp frontend/.env.local.example frontend/.env.local 2>/dev/null || true
fi

# Start services
echo "🐳 Starting Docker Compose services..."
docker-compose up -d

# Wait for postgres to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run migrations
echo "🔄 Running database migrations..."
docker-compose exec -T backend pnpm prisma migrate deploy || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Services running at:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:4000"
echo "   Database:  localhost:5432"
echo ""
echo "📋 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down"
