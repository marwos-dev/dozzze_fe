# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20-alpine

# ───── Base ─────
FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV TZ=UTC \
    NEXT_TELEMETRY_DISABLED=1

# ───── Dependencies (cacheable) ─────
FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts --prefer-offline --no-audit --progress=false

# ───── Builder (Next.js build) ─────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/.next/cache \
    npm run build

# ───── Runtime (imagen final mínima) ─────
FROM base AS runner
RUN addgroup -S app && adduser -S app -G app
RUN mkdir -p /app/.next/cache && chown -R app:app /app
USER app


COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "node_modules/.bin/next", "start"]
