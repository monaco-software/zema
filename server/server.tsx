import fs from 'fs';
import https from 'https';
import express from 'express';
import root from 'app-root-path';
import cookieParser from 'cookie-parser';
import { isProduction } from '@common/utils';
import { cspHeader } from './middlewares/csp';
import { PrismaClient } from '@prisma/client';
import { forumApi } from './controllers/forumApi';
import { ssrHandler } from '@server/ssr/ssrHandler';
import { userApi } from '@server/controllers/userApi';
import { yandexApiProxy } from './controllers/yandexApiProxy';

export const prisma = new PrismaClient();

const port = process.env.PORT || 5000; // yandex OAuth работает только на 5000

const app = express();

app.use(cspHeader);

app.use(cookieParser());

app.use(express.json());

app.use(express.static(root.resolve('ssr/dist')));

yandexApiProxy(app);

forumApi(app);

userApi(app);

ssrHandler(app);

if (!isProduction) {
  // ключи созданы командой
  // mkcert localhost 127.0.0.1 ::1
  // https://github.com/FiloSottile/mkcert
  // чтобы не ругался браузер можно добавить локальный CA
  // пока решил оставить их в git
  const key = fs.readFileSync(root.resolve('localhost+2-key.pem'));
  const cert = fs.readFileSync(root.resolve('localhost+2.pem'));
  const server = https.createServer({ key, cert }, app);
  server.listen(port, () => {
    console.info(`HTTPS Listening on port ${port}`);
  });
} else {
  app.listen(port, () => {
    console.info(`HTTP Listening on port ${port}`);
  });
}
