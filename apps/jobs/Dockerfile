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

COPY apps/jobs/package.json ./apps/jobs/
COPY libs/graphql/package.json ./libs/graphql/
COPY libs/grpc/package.json ./libs/grpc/
COPY libs/pulsar/package.json ./libs/pulsar/

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

COPY apps/jobs ./apps/jobs
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs
COPY libs/pulsar ./libs/pulsar

COPY .nxignore* ./

RUN npx nx build jobs

FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/apps/jobs/package.json ./apps/jobs/
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/
COPY --from=builder /workspace/libs/pulsar/package.json ./libs/pulsar/

ENV NODE_ENV=production

RUN npm ci

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/jobs/main"]