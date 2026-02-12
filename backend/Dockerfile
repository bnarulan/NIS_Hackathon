FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

RUN mkdir -p uploads

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]