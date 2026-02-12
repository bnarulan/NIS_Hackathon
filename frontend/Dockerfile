# syntax=docker/dockerfile:1
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
# Prevent inherited/broken proxy config from stalling npm in some host environments
RUN npm config delete proxy || true \
 && npm config delete https-proxy || true \
 && npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]