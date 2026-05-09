# Quick Reference - Common Commands

## 🚀 Quick Start

### Windows (PowerShell)
```powershell
.\setup.ps1
```

### Mac/Linux (Bash)
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Start
```bash
docker-compose up -d
```

---

## 🐳 Docker Compose Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services in background |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | View all logs (live) |
| `docker-compose logs -f backend` | View backend logs |
| `docker-compose logs -f frontend` | View frontend logs |
| `docker-compose logs -f postgres` | View database logs |
| `docker-compose ps` | Show running services |
| `docker-compose restart` | Restart all services |
| `docker-compose build` | Rebuild images |
| `docker-compose down -v` | Stop & remove volumes (reset DB) |

---

## 📦 Backend Commands (from backend/ directory)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `npx prisma migrate dev` | Create & run migration |
| `npx prisma migrate reset` | Reset DB (⚠️ deletes data!) |
| `npx prisma studio` | Open database UI at localhost:5555 |
| `npx prisma generate` | Generate Prisma client |

---

## 🎨 Frontend Commands (from frontend/ directory)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server at :3000 |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm lint` | Lint code |

---

## 🔗 Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Database (psql) | localhost:5432 |
| Prisma Studio | http://localhost:5555 |

---

## 📝 Environment Setup

### Backend (.env.local required)
```bash
cd backend
cp .env.local.example .env.local
# Edit .env.local with your values
```

### Frontend (.env.local required)
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your values
```

---

## 🐛 Troubleshooting

### Port in use?
```bash
# Windows - Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Mac/Linux - Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Reset everything?
```bash
docker-compose down -v && docker-compose up -d
```

### Dependencies issue?
```bash
# Backend
cd backend && rm -rf node_modules pnpm-lock.yaml && pnpm install

# Frontend
cd frontend && rm -rf node_modules pnpm-lock.yaml && pnpm install
```

### View database?
```bash
# With Prisma Studio
cd backend && npx prisma studio

# Or with psql
psql -h localhost -U postgres -d aica
```

---

## 📚 Documentation

- Full guide: [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)
- Kubernetes: [k8s/DEPLOYMENT.md](k8s/DEPLOYMENT.md)
- Auth setup: [backend/README_AUTH.md](backend/README_AUTH.md)
- Main README: [README.md](README.md)

---

## ✅ Health Checks

```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:4000/health

# Database
docker-compose exec postgres pg_isready -U postgres
```
