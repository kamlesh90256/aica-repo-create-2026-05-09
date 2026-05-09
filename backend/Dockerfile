FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate || true
COPY . .
RUN pnpm install --frozen-lockfile --unsafe-perm
RUN pnpm prisma generate || true
RUN pnpm build || true
EXPOSE 4000
CMD ["pnpm", "dev"]
