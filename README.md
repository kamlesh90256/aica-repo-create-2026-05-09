AI Career Assistant Chatbot

Production-ready scaffold for an AI-powered career assistant chatbot.

Components:
- `frontend/` — Next.js 15 + TypeScript + Tailwind + ShadCN scaffold
- `backend/` — Express.js + TypeScript API server with Prisma
- `k8s/` — Kubernetes manifests for deployment
- `docker-compose.yml` — local dev with Postgres

Quick start (development):

1. Create `.env` files in `backend/` and set `DATABASE_URL`, `OPENAI_API_KEY`, `JWT_SECRET`, etc.
2. Run Postgres locally or use Docker Compose:

```bash
docker-compose up -d
```

3. Backend: install and run

```bash
cd backend
pnpm install # or npm install
pnpm prisma generate
pnpm dev
```

4. Frontend: install and run

```bash
cd frontend
pnpm install
pnpm dev
```

This scaffold includes API endpoints for chat, upload, resume analysis, authentication stubs, Prisma schema, Dockerfiles, Kubernetes manifests, and CI templates.
