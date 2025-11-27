# Base Image
FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgif7 \
    libjpeg62-turbo \
    libpng16-16 \
    librsvg2-2 \
    libexpat1 \
    && rm -rf /var/lib/apt/lists/*

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

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/bot/node_modules ./node_modules
COPY --from=builder /app/apps/bot/dist ./dist
COPY --from=builder /app/apps/bot/fonts ./fonts
COPY --from=deps /app/apps/bot/package.json ./package.json

CMD ["node", "dist/index.js"]
