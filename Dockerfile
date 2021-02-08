FROM node:14-slim

WORKDIR /app

COPY . .

RUN npm ci && npm run build

CMD node server
