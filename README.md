# NovaMind AI

NovaMind AI is an ultra-modern AI Chatbot SaaS platform with premium UI/UX, realtime streaming chat, SaaS-ready architecture, and deployment scaffolding.

## Stack

- Frontend: Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion, Zustand, React Query, Lucide Icons, Markdown rendering
- Backend: Node.js, Express.js, TypeScript, Socket.IO, Zod validation, security middleware
- Database: PostgreSQL + Prisma ORM
- AI: OpenAI API + local fallback assistant for offline/local mode
- DevOps: Docker, Kubernetes manifests, GitHub Actions CI

## Implemented Core Features

- Premium landing page with gradient visuals and glassmorphism UI
- Realtime streaming chat experience with modern sidebar conversation UX
- Markdown chat rendering with syntax highlighting
- Multi-conversation memory (client-side Zustand store)
- Auth page redesign and token flow
- Dashboard and Admin pages with SaaS analytics layout
- Backend chat API with validation and fallback provider
- Streaming SSE endpoint: `POST /api/chat/stream`
- Secure API baseline: Helmet, CORS policy, request rate limiting
- Expanded Prisma schema for SaaS entities:
  - Users, Chats, Messages, Files, Resumes
  - Interviews, Subscriptions, Payments

## Local Development (Without Docker)

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

App URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Health: http://localhost:4000/api/health

## Docker Note

Docker commands are already configured in this repository, but Docker Engine/Desktop must be installed and running on your machine.

VS Code Docker extension is installed: `ms-azuretools.vscode-docker`.

## Environment Variables

Backend (`backend/.env.local`):

- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional)
- `CORS_ORIGIN`

Frontend (`frontend/.env.local`):

- `NEXT_PUBLIC_API_URL=http://localhost:4000`

## Streaming API Example

```bash
curl -X POST http://localhost:4000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Create a backend roadmap"}]}'
```

## Prisma

Generate client:

```bash
cd backend
npx prisma generate
```

Apply migrations (after creating migration files):

```bash
npx prisma migrate dev
```

## Deployments

- Vercel: Frontend deployment ready (`frontend/`)
- AWS/Kubernetes: manifests available in `k8s/`
- Docker: production and development Dockerfiles available in `backend/` and `frontend/`

## Current Status

NovaMind now runs as a premium SaaS-grade foundation with live streaming AI chat and polished UI. Remaining integrations (Clerk, Stripe webhooks, Pinecone production pipeline, voice/image generation) can be layered on this architecture with dedicated service modules.

