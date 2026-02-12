# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim

WORKDIR /usr/src/app

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json .npmrc ./
RUN npm config delete proxy || true \
 && npm config delete https-proxy || true \
 && npm ci --no-audit --no-fund

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

RUN mkdir -p uploads

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]