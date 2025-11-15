FROM node:22-alpine AS base

# 1. 가지치기
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN npm install turbo --global
WORKDIR /app
COPY . .
RUN turbo prune --scope=@repo/web --docker

# 2. 설치 및 빌드
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install

COPY --from=builder /app/out/full/ .
# Next.js 빌드 시 환경변수가 필요할 수 있음
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WEBSOCKET_URL
ENV BUILD_ENV=docker
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WEBSOCKET_URL=$NEXT_PUBLIC_WEBSOCKET_URL

RUN pnpm turbo run build --filter=@repo/web...

# 3. 실행
FROM base AS runner
WORKDIR /app
# standalone 결과물 복사
COPY --from=installer /app/apps/web/.next/standalone ./
COPY --from=installer /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer /app/apps/web/public ./apps/web/public

CMD ["node", "apps/web/server.js"]