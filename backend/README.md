# Backend

Express + TypeScript backend for AI Career Assistant.

Local dev:

1. Copy `.env.example` to `.env` and set values.
2. Install dependencies: `pnpm install` (or `npm install`).
3. Generate Prisma client: `pnpm prisma generate`.
4. Start: `pnpm dev`.

APIs:
- `POST /api/chat` - chat with AI (expects messages array)
- `POST /api/upload` - upload files
- `POST /api/resume/analyze` - resume analysis (file field: `resume`)
