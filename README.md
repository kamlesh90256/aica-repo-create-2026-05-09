# NovaMind AI — Premium AI Chatbot SaaS Platform

A production-ready, enterprise-grade AI chatbot platform built with modern TypeScript, Next.js, and Node.js. NovaMind AI provides real-time streaming conversations, multi-user support, subscription management, and comprehensive API integrations.

**Repository:** [github.com/kamlesh90256/aica-repo-create-2026-05-09](https://github.com/kamlesh90256/aica-repo-create-2026-05-09)

---

## 🎯 Overview

NovaMind AI is a fully-featured SaaS platform enabling organizations to integrate advanced AI-powered conversations into their applications. Built with scalability, security, and user experience in mind:

- **Real-time Streaming Chat** — Server-sent events (SSE) for low-latency conversational AI
- **Multi-User Support** — User authentication, profiles, and conversation history
- **Subscription Management** — Stripe integration for premium tier management
- **File Handling** — Resume uploads and document processing
- **Admin Dashboard** — Analytics and user management interface
- **Cloud-Ready Deployment** — Kubernetes manifests, Docker containers, CI/CD workflows

---

## 🛠️ Technical Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion, Zustand, React Query |
| **Backend** | Node.js, Express.js, TypeScript, Socket.IO, Zod validation |
| **Database** | PostgreSQL, Prisma ORM |
| **AI** | OpenAI API + local fallback provider |
| **Security** | Helmet, JWT authentication, CORS, rate limiting |
| **Payments** | Stripe API (checkout, subscriptions, webhooks) |
| **DevOps** | Docker, Kubernetes, GitHub Actions CI/CD |

---

## ✨ Features

### 🎨 Frontend
- Modern, responsive UI with Tailwind CSS and Framer Motion animations
- Real-time chat interface with message streaming
- Markdown rendering with syntax highlighting
- Dark/Light theme toggle
- Multi-conversation management (Zustand store)
- Admin dashboard with analytics
- Secure authentication flow

### 🔧 Backend
- RESTful API with Express.js & TypeScript
- Streaming chat endpoint with SSE
- User management (signup, login, profiles)
- Conversation & message history
- File upload & resume processing
- Stripe payment webhook handlers
- Health check endpoint (`GET /api/health`)

### 💾 Database
- Users & authentication
- Chats, messages, and conversation history
- Files & resume uploads
- Subscriptions & payment tracking
- Interviews & candidate data

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (v22 recommended)
- npm or yarn
- PostgreSQL 13+
- OpenAI API key (optional for local mode)
- Stripe API keys (optional for payments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kamlesh90256/aica-repo-create-2026-05-09.git
   cd aica-repo-create-2026-05-09
   ```

2. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure environment variables:**
   
   Backend (`.env`):
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/novamind_ai
   OPENAI_API_KEY=sk_...
   STRIPE_SECRET_KEY=sk_...
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```
   
   Frontend (`.env.local`):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

4. **Set up the database:**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

---

## 🏃 Running Locally

**Backend:**
```bash
cd backend
npm start          # Production mode
npm run dev        # Development mode (hot reload)
```

**Frontend:**
```bash
cd frontend
npm run dev        # Development server on port 3000
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/api/health

---

## 📡 API Documentation

### Chat
- **POST** `/api/chat/stream` — Stream chat responses via SSE
  - Body: `{ message: string, conversationId?: string }`
  - Response: `text/event-stream`

### Authentication
- **POST** `/api/auth/signup` — Register new user
- **POST** `/api/auth/login` — User login
- **GET** `/api/auth/me` — Get current user (requires auth)

### Payments
- **POST** `/api/payments/checkout` — Create Stripe checkout session
- **POST** `/api/payments/webhook` — Handle Stripe webhooks
- **GET** `/api/payments/subscription` — Get user subscription (requires auth)

### Files & Uploads
- **POST** `/api/upload` — Upload file
- **POST** `/api/resume` — Process resume file

---

## 🐳 Deployment

### Docker
```bash
docker-compose build
docker-compose up
```

### Kubernetes
```bash
cd k8s
kubectl apply -f .
```

### CI/CD
GitHub Actions (`.github/workflows/ci.yml`) automatically:
- Builds frontend & backend on push to `main`
- Runs tests and linting
- Generates Prisma client

---

## 📋 Project Structure

```
.
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic (Stripe, embeddings, etc.)
│   │   ├── middleware/   # Auth, validation
│   │   └── index.ts      # Express app entry
│   └── prisma/           # Database schema
├── frontend/             # Next.js React app
│   ├── app/              # Pages and layouts
│   ├── src/components/   # Reusable components
│   └── src/store/        # Zustand state management
├── k8s/                  # Kubernetes manifests
├── .github/workflows/    # CI/CD pipelines
└── docker-compose.yml    # Local development stack
```

---

## 📝 License

Licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📧 Support

For issues, questions, or feature requests, please [open an issue](https://github.com/kamlesh90256/aica-repo-create-2026-05-09/issues) on GitHub.

---

**Built with ❤️ by the NovaMind AI team**

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

