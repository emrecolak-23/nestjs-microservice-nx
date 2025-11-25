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

COPY apps/executor/package.json ./apps/executor/
COPY libs/pulsar/package.json ./libs/pulsar/
COPY libs/grpc/package.json ./libs/grpc/

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler


COPY apps/executor ./apps/executor
COPY libs/nestjs ./libs/nestjs
COPY libs/pulsar ./libs/pulsar
COPY libs/grpc ./libs/grpc


COPY .nxignore* ./

RUN npx nx build executor

FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/apps/executor/package.json ./apps/executor/
COPY --from=builder /workspace/libs/pulsar/package.json ./libs/pulsar/
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/

ENV NODE_ENV=production

RUN npm ci

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/executor/main"]