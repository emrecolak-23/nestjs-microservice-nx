FROM node:24-slim AS builder

WORKDIR /workspace


ENV HUSKY=0

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY webpack.*.config.js ./

COPY apps/products/package.json ./apps/products/
COPY libs/grpc/package.json ./libs/grpc/

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

COPY apps/products ./apps/products
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs

COPY .nxignore* ./

RUN npx nx build products

FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/apps/products/package.json ./apps/products/
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/

ENV NODE_ENV=production

RUN npm ci

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/products/main"]