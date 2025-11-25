# Base Image
FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# Install production deps for the bot workspace member only
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/bot/package.json ./apps/bot/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter @pepeboard/bot --prod --frozen-lockfile

# Build the Discord bot
FROM base AS builder

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter @pepeboard/bot --frozen-lockfile
RUN pnpm --filter @pepeboard/bot run build

# Production image that only contains what the bot needs
FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app/apps/bot

COPY --from=deps /app/node_modules ../node_modules
COPY --from=builder /app/apps/bot/dist ./dist
COPY --from=builder /app/apps/bot/fonts ./fonts

CMD ["node", "dist/index.js"]
