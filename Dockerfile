FROM node:14-buster

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y netcat

RUN npm ci

RUN npm config set script-shell bash
RUN until npx prisma generate; do echo ...; sleep 1; done

RUN npm run build

CMD npm start
