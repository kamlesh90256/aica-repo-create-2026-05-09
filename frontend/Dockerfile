FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate || true
COPY . .
RUN pnpm install --frozen-lockfile --unsafe-perm
RUN pnpm build || true
EXPOSE 3000
CMD ["pnpm", "dev"]
