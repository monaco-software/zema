/* eslint-disable new-cap */
import './index.css';
import * as fs from 'fs';
import https from 'https';
import express from 'express';
import fetch from 'node-fetch';
import root from 'app-root-path';
import React, { FC } from 'react';
// import enforce from 'express-sslify';
import cookieParser from 'cookie-parser';
import { Provider } from 'react-redux';
import { HTTP_METHODS } from '@api/core';
import { App } from '@components/App/App';
import { ROUTES } from '@common/constants';
import { StaticRouter } from 'react-router';
import { appActions } from '@store/reducer';
import { isProduction } from '@common/utils';
import { cspHeader } from './middlewares/csp';
import { renderToString } from 'react-dom/server';
import { API_PATH, getFullPath } from '@api/paths';
import { PrismaClient, Theme } from '@prisma/client';
import { createStore, RootState } from '@store/store';
import { getUserWithFullAvatarUrl } from '@common/helpers';
import { yandexApiProxy } from './middlewares/yandexApiProxy';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { AppErrorBoundary } from '@components/AppErrorBoundary/AppErrorBoundary';
import {
  getCookies,
  getCookiesFromApiResponse,
  setCookies,
} from './middlewares/helpers';

const prisma = new PrismaClient();

const port = process.env.PORT || 5000; // yandex OAuth работает только на 5000

const sheet = new ServerStyleSheet();
const app = express();
if (isProduction) {
  // перенаправляет HTTP в HTTPS
  // app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
app.use(cspHeader);

app.use(cookieParser());

app.use(express.json());

app.use(express.static(root.resolve('ssr/dist')));

yandexApiProxy(app);

const jsFiles: string[] = [];
const cssFiles: string[] = [];
const manifestFiles: string[] = [];
let themes: Theme[] = [];

const updateChunks = () => {
  jsFiles.length = 0;
  cssFiles.length = 0;
  manifestFiles.length = 0;
  const chunks: string[] = JSON.parse(
    // читает файл, созданный клиентской сборкой
    // в нем массив имен чанков
    fs.readFileSync(root.resolve('ssr/dist/stats.json'), 'utf8')
  );

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
  const store = createStore();

  Object.keys(ROUTES).forEach((route) => {
    renderToString(
      <Provider store={store}>
        <StyleSheetManager sheet={sheet.instance}>
          <StaticRouter location={route}>
            {sheet.getStyleElement()}
            <App />
          </StaticRouter>
        </StyleSheetManager>
      </Provider>
    );
  });
};

updateChunks();
getStyles();

interface Props {
  serverState: RootState;
}

const Html: FC<Props> = ({ children, serverState }) => {
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
            __html: `window.__SERVER_STATE__ = ${JSON.stringify(
              serverState
            ).replace(/</g, '\\u003c')}`,
          }}
        />
        {jsFiles.map((script, index) => (
          <script src={script} key={index} />
        ))}
      </body>
    </html>
  );
};

const getAppHtml = (
  reduxStore: ReturnType<typeof createStore>,
  locationUrl: string
) => {
  const serverState = reduxStore.getState();

  return renderToString(
    <Html serverState={serverState}>
      <AppErrorBoundary>
        <Provider store={reduxStore}>
          <StyleSheetManager sheet={sheet.instance}>
            <StaticRouter location={locationUrl || '/'}>
              {sheet.getStyleElement()}
              <App />
            </StaticRouter>
          </StyleSheetManager>
        </Provider>
      </AppErrorBoundary>
    </Html>
  );
};

const getThemes = async () => {
  return await prisma.theme.findMany({
    orderBy: {
      id: 'asc',
    },
  });
};

const getUserTheme = async (userId: number) => {
  let user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
      },
    });
  }
  return user.themeId;
};

const setUserTheme = async (userId: number, themeId: number) => {
  await prisma.user.upsert({
    where: {
      id: userId,
    },
    update: {
      themeId,
    },
    create: {
      id: userId,
      themeId,
    },
  });
};

app.put(API_PATH.USER_THEME_UPDATE, (req, res) => {
  const fetchUser = (headers: Record<string, string>) => {
    fetch(getFullPath(API_PATH.AUTH_USER), {
      method: HTTP_METHODS.GET,
      headers: {
        ...headers,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const userData = await response.json();
          if (!themes || !isProduction) {
            themes = await getThemes();
          }
          setUserTheme(userData.id, req.body.themeId).then(() =>
            res.sendStatus(200)
          );
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send(error);
      });
  };
  fetchUser(getCookies(req));
});

app.get('*', (req, res) => {
  if (!isProduction) {
    getStyles();
    updateChunks();
  }

  console.info(req.method, req.hostname, req.url, res.statusCode);

  const store = createStore();

  const fetchUser = (headers: Record<string, string>) => {
    fetch(getFullPath(API_PATH.AUTH_USER), {
      method: HTTP_METHODS.GET,
      headers: {
        ...headers,
      },
    })
      .then(async (response) => {
        if (!themes.length || !isProduction) {
          themes = await getThemes();
        }
        themes.forEach((theme) => {
          store.dispatch(appActions.addTheme(theme));
        });
        if (response.ok) {
          const userData = await response.json();
          const userDataWithFullAvatar = getUserWithFullAvatarUrl(userData);
          store.dispatch(appActions.setUser(userDataWithFullAvatar));
          store.dispatch(appActions.setIsSignedIn(true));
          const currentTheme = await getUserTheme(userData.id);
          store.dispatch(appActions.setCurrentTheme(currentTheme));
        }
      })
      .catch(console.error)
      .finally(() => {
        store.dispatch(appActions.setIsSSR(true));

        const html = getAppHtml(store, req.url);
        res.send(html);
      });
  };

  const { code } = req.query;
  // Если есть code, значит происходит Yandex OAuth
  if (code && typeof code === 'string') {
    fetch(getFullPath(API_PATH.OAUTH_YANDEX_SIGN_IN), {
      method: HTTP_METHODS.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then((apiResponse) => {
        setCookies(apiResponse, res);

        fetchUser(getCookiesFromApiResponse(apiResponse));
      })
      .catch((error) => {
        console.error(error);
        fetchUser(getCookies(req));
      });

    return;
  }

  fetchUser(getCookies(req));
});

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
