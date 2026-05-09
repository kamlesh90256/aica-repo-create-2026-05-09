# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate || true
COPY . .
RUN pnpm install --frozen-lockfile --unsafe-perm
RUN pnpm build

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache tini
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate || true
RUN pnpm install --frozen-lockfile --unsafe-perm --prod
RUN pnpm add -g next
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["next", "start"]
