FROM node:24-slim AS builder

WORKDIR /workspace

RUN apt-get update && apt-get install -y openssl 

ENV HUSKY=0

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY webpack.*.config.js ./

COPY apps/auth/package.json ./apps/auth/
COPY libs/graphql/package.json ./libs/graphql/
COPY libs/grpc/package.json ./libs/grpc/
COPY libs/prisma/package.json ./libs/prisma/

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

COPY apps/auth ./apps/auth
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs
COPY libs/prisma ./libs/prisma

RUN npx prisma generate --schema=./apps/auth/prisma/schema.prisma


COPY .nxignore* ./

RUN npx nx build auth

FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/apps/auth/package.json ./apps/auth/
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/
COPY --from=builder /workspace/libs/prisma/package.json ./libs/prisma/

ENV NODE_ENV=production

RUN npm ci

COPY --from=builder /workspace/node_modules/@prisma-clients/auth/ ./node_modules/@prisma-clients/auth/

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/auth/main"]