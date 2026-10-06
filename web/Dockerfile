# syntax=docker/dockerfile:1.4

# ==========================================
# 1. Base Stage: Node.js 20 with pnpm
# ==========================================
FROM node:20-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app

# ==========================================
# 2. Dependencies Stage: Native Addons & pnpm Cache
# ==========================================
FROM base AS deps
# Install build tools required for compiling native C/C++ addons (e.g. swisseph, node-gyp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests first to maximize Docker layer cache hits
COPY package.json .npmrc* ./

# Fast install using BuildKit cache mount for pnpm store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install

# ==========================================
# 3. Builder Stage: Next.js Optimized Build
# ==========================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build with cache mount for .next/cache to enable instant incremental rebuilds
RUN --mount=type=cache,id=next,target=/app/.next/cache \
    pnpm build

# ==========================================
# 4. Runner Stage: Lightweight Secure Production Container
# ==========================================
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security: run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and public directory
COPY --from=builder /app/public ./public

# Copy assets required at runtime by server (e.g. Cyrillic fonts for PDF generation)
COPY --from=builder --chown=nextjs:nodejs /app/src/shared/assets ./src/shared/assets

# Copy Next.js standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
