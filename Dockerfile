# Base Image

FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# App Dependencies 

FROM base AS deps

COPY package.json pnpm-lock.yaml /app/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build App

FROM base AS builder

COPY . /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm run build

# Production Image

FROM base

ENV NODE_ENV production

COPY /fonts /app/fonts

COPY --from=deps /app/node_modules /app/node_modules

COPY --from=builder /app/dist /app/dist

CMD ["node", "dist/index.js"]
