# 1. 기본 이미지
FROM node:22-alpine AS base

# 2. 빌드 전 가지치기 (Prune)
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN npm install turbo --global
WORKDIR /app
COPY . .
# 'api' 앱에 필요한 패키지만 골라냄
RUN turbo prune --scope=@repo/api --docker

# 3. 의존성 설치 및 빌드
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 가지치기된 패키지 정보 복사
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install

# 소스 코드 복사 및 빌드
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run db:generate --filter=@repo/db
RUN pnpm turbo run build --filter=@repo/api...

# 4. 실행 (Runner)
FROM base AS runner
WORKDIR /app
COPY --from=installer /app .

# Prisma 설치 및 마이그레이션 실행
RUN npm install -g prisma
RUN prisma generate --schema=packages/db/prisma/schema.prisma

# NestJS 실행 (main.js 경로 확인 필요: 보통 dist/main.js)
CMD [ "sh", "-c", "prisma migrate deploy --schema=packages/db/prisma/schema.prisma && node apps/api/dist/main.js" ]