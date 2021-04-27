import fs from 'fs';
import fetch from 'node-fetch';
import root from 'app-root-path';
import React, { FC } from 'react';
import { Express } from 'express';
import { Provider } from 'react-redux';
import { HTTP_METHODS } from '@api/core';
import { App } from '@components/App/App';
import { ROUTES } from '@common/constants';
import { appActions } from '@store/reducer';
import { StaticRouter } from 'react-router';
import { isProduction } from '@common/utils';
import { renderToString } from 'react-dom/server';
import { UserModel } from '@server/models/UserModel';
import { createStore, RootState } from '@store/store';
import { ThemeModel } from '@server/models/ThemeModel';
import { getUserWithFullAvatarUrl } from '@common/helpers';
import { API_PATH, getFullPath } from '@server/router/paths';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { AppErrorBoundary } from '@components/AppErrorBoundary/AppErrorBoundary';
import {
  getCookies,
  getCookiesFromApiResponse,
  setCookies,
} from '@server/lib/cookies';

const sheet = new ServerStyleSheet();
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
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Zooma Deluxe</title>

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

export const ssrHandler = (app: Express) => {
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
          const themes = await ThemeModel.getThemes();
          themes.forEach((theme) => {
            store.dispatch(appActions.addTheme(theme));
          });
          if (response.ok) {
            const userData = await response.json();
            const userDataWithFullAvatar = getUserWithFullAvatarUrl(userData);
            store.dispatch(appActions.setCurrentUser(userDataWithFullAvatar));
            store.dispatch(appActions.setIsSignedIn(true));
            const currentTheme = await UserModel.getUserTheme({
              userId: userData.id,
            });
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
};
