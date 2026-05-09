# Local Development Setup Guide

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git

### Option 1: Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Database**: localhost:5432

### Option 2: Manual Setup (Local)

#### Backend Setup
```bash
cd backend

# Install dependencies
pnpm install

# Setup database
npx prisma migrate dev

# Start development server
pnpm dev
```
Backend runs at: http://localhost:4000

#### Frontend Setup
```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```
Frontend runs at: http://localhost:3000

### Database Setup (if running locally)
```bash
# Install PostgreSQL 15 or use Docker
docker run --name aica-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=aica \
  -p 5432:5432 \
  -d postgres:15-alpine

# Run migrations
cd backend
npx prisma migrate dev
```

## Environment Variables

### Backend (.env.local)
Create `backend/.env.local`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aica
JWT_SECRET=dev-secret-key
OPENAI_API_KEY=your-key-here
NODE_ENV=development
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Available Commands

### Backend
```bash
cd backend

# Start dev server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production build
pnpm start

# Generate Prisma client
pnpm prisma:generate

# Run migrations
npx prisma migrate dev
npx prisma migrate reset  # Reset database (deletes data!)
npx prisma studio        # Open Prisma Studio UI
```

### Frontend
```bash
cd frontend

# Start dev server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production build
pnpm start

# Lint code
pnpm lint
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Remove volumes (clears database)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

## Database Management

### Prisma Studio (UI for database)
```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

### Prisma Migrations
```bash
cd backend

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Generate Prisma client
npx prisma generate
```

### Direct Database Access
```bash
# Using psql
psql -h localhost -U postgres -d aica

# Using pgAdmin (optional Docker container)
docker run --name pgadmin \
  -e PGADMIN_DEFAULT_EMAIL=admin@example.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  -p 5050:80 \
  -d dpage/pgadmin4
# Access at http://localhost:5050
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# or change ports in docker-compose.yml
```

### Database Connection Failed
```bash
# Check if postgres is running
docker-compose ps

# Check postgres logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
cd backend
rm -rf node_modules pnpm-lock.yaml
pnpm install

cd ../frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Hot Reload Not Working
- Ensure volume mounts are correct in docker-compose.yml
- Restart containers: `docker-compose restart`
- Check file permissions

### Build Fails in Docker
```bash
# Rebuild images without cache
docker-compose build --no-cache
docker-compose up -d
```

## Development Tips

1. **Use Prisma Studio** for easy database management
2. **Check logs** when things don't work: `docker-compose logs -f service-name`
3. **Reset everything**: `docker-compose down -v && docker-compose up -d`
4. **Keep .env.local in .gitignore** (don't commit secrets)
5. **Use the correct ports**: Frontend 3000, Backend 4000, Database 5432

## Next Steps

1. Copy `.env.local` files from examples
2. Add your API keys (OpenAI, etc.)
3. Run migrations: `npx prisma migrate dev`
4. Start development: `docker-compose up -d`
5. Access http://localhost:3000
