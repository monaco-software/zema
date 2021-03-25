/* eslint-disable new-cap */
import './index.css';
import * as fs from 'fs';
import React from 'react';
import https from 'https';
import express from 'express';
import root from 'app-root-path';
import enforce from 'express-sslify';
import { store } from '@store/store';
import { Provider } from 'react-redux';
import { App } from '@components/App/App';
import { ROUTES } from '@common/constants';
import { StaticRouter } from 'react-router';
import { isProduction } from '@common/utils';
import { cspHeader } from './middlewares/csp';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { NotificationStatus } from '@components/Notification/Notification';
import { AppErrorBoundary } from '@components/AppErrorBoundary/AppErrorBoundary';

const port = process.env.PORT || 3000;

const sheet = new ServerStyleSheet();
const serverState = store.getState();
const app = express();
if (isProduction) {
  // перенаправляет HTTP в HTTPS
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
app.use(cspHeader);

app.use(express.static(root.resolve('ssr/dist')));

const jsFiles: string[] = [];
const cssFiles: string[] = [];
const manifestFiles: string[] = [];

const updateChunks = () => {
  jsFiles.length = 0;
  cssFiles.length = 0;
  manifestFiles.length = 0;
  const chunks: string[] = JSON.parse(
    // читает файл, созданный клиентской сборкой
    // в нем массив имен чанков
    fs.readFileSync(root.resolve('ssr/dist/stats.json'), 'utf8'));

  chunks.forEach((chunk) => {
    const url = '/' + chunk;
    const type = chunk.split('.').pop();
    if (type === 'js') {
      jsFiles.push(url);
    }
    if (type === 'css') {
      cssFiles.push(url);
    }
    if (type === 'manifest') {
      manifestFiles.push(url);
    }
  });
};

const getStyles = () => {
  // это хак, чтобы отдать styled elements из grommet
  // проходим по всем маршрутам при этом
  // sheet наполняется классами, использованными на страницах
  // в принципе можно вынести в мидлварю и
  // делать каждый раз перед рендерингом без forEach
  Object.keys(ROUTES).forEach((route) => {
    renderToString(
      <Provider store={store}>
        <StyleSheetManager sheet={sheet.instance}>
          <StaticRouter location={route}>
            {sheet.getStyleElement()}
            <App />
          </StaticRouter>
        </StyleSheetManager>
      </Provider>,
    );
  });
};

updateChunks();
getStyles();

interface Props {
  children: React.ReactNode;
}

const Html = ({ children }: Props) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Zooma</title>

        {cssFiles.map((css, index) => (
          <link rel="stylesheet" href={css} key={index} />
        ))}
        {manifestFiles.map((manifest, index) => (
          <link rel="manifest" href={manifest} key={index} />
        ))}
        {!isProduction && <script src="/reload.js" />}
      </head>
      <body>
        <div id="root">{children}</div>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__SERVER_STATE__ = ${JSON.stringify(serverState).replace(/</g, '\\u003c')}`,
          }}
        />
        {jsFiles.map((script, index) => (
          <script src={script} key={index} />
        ))}
      </body>
    </html>
  );
};

app.get('*', (req, res) => {
  if (!isProduction) {
    getStyles();
    updateChunks();
  }
  console.info(req.method, req.hostname, req.url, res.statusCode);

  // можно попробовать renderToNodeStream
  // но разницы я не заметил
  const html = renderToString(
    <Html>
      <AppErrorBoundary>
        <Provider store={store}>
          <StyleSheetManager sheet={sheet.instance}>
            <StaticRouter location={req.url || '/'}>
              {sheet.getStyleElement()}
              <App />
            </StaticRouter>
          </StyleSheetManager>
        </Provider>
      </AppErrorBoundary>
    </Html>,
  );
  res.send(html);
});

if (!isProduction) {
  serverState.app.notification = { message: 'Hello from node server', status: NotificationStatus.INFO };
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

