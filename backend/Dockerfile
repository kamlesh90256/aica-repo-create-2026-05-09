# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate || true
COPY . .
RUN pnpm install --frozen-lockfile --unsafe-perm
RUN pnpm prisma generate || true
RUN pnpm build || true

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache tini
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate || true
RUN pnpm install --frozen-lockfile --unsafe-perm --prod
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["pnpm", "start"]
