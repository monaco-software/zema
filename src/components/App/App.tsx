import './app.css';
import b_ from 'b_';
import React, { FC, useEffect, useState } from 'react';
import { Game } from '@pages/game/Game';
import { Grommet, Main } from 'grommet';
import { Root } from '@pages/root/Root';
import { isServer } from '@common/utils';
import { Navbar } from '../Navbar/Navbar';
import { useSelector } from 'react-redux';
import { deepMerge } from 'grommet/utils';
import { ROUTES } from '@common/constants';
import { Spinner } from '../Spinner/Spinner';
import { SignIn } from '@pages/signin/SignIn';
import { SignUp } from '@pages/signup/SignUp';
import { grommetTheme } from './grommetTheme';
import { useAsyncAction } from '@common/hooks';
import { Forum } from '@pages/forum/Forum/Forum';
import { Account } from '@pages/account/Account';
import { GameOver } from '@pages/gameOver/GameOver';
import { asyncAppActions } from '@store/asyncActions';
import { GameLevels } from '@pages/gameLevels/GameLevels';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Leaderboard } from '@pages/leaderboard/Leaderboard';
import { ForumTopic } from '@pages/forum/ForumTopic/ForumTopic';
import { AppNotification } from '../Notification/AppNotification';
import {
  getCurrentTheme,
  getCurrentUserId,
  getIsSSR,
  getThemes,
} from '@store/selectors';

const block = b_.lock('app');

const onLoad = () => {
  if (process.env.NODE_ENV === 'production') {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.info('SW registered: ', registration);
      })
      .catch((error) => {
        console.error('SW registration failed: ', error);
      });
  }
};

export const App: FC = () => {
  const history = useHistory();

  const isSSR = useSelector(getIsSSR);
  const currentTheme = useSelector(getCurrentTheme);
  const themes = useSelector(getThemes);
  const currentUserId = useSelector(getCurrentUserId);

  const fetchUser = useAsyncAction(asyncAppActions.fetchUser);
  const fetchThemes = useAsyncAction(asyncAppActions.fetchThemes);
  const fetchUserTheme = useAsyncAction(asyncAppActions.fetchUserTheme);

  const [isLoading, setIsLoading] = useState(!isSSR);

  useEffect(() => {
    // Чистим code который остается от yandex OAuth
    const url = new URL(window.location.href);

    if (url.searchParams.has('code')) {
      history.replace(ROUTES.ROOT);
    }
  }, []);

  useEffect(() => {
    if (isSSR) {
      return;
    }
    fetchThemes()
      .then(() => {
        fetchUser().finally(() => setIsLoading(false));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isSSR) {
      return;
    }
    fetchUserTheme({ userId: currentUserId }).catch(console.error);
  }, [currentUserId]);

  useEffect(() => {
    if (isSSR) {
      return;
    }
  }, [currentTheme]);

  useEffect(() => {
    if (isServer) {
      return;
    }
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', onLoad);
    }
    return () => {
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <Grommet
      className={block()}
      theme={deepMerge(grommetTheme, themes[currentTheme]?.data || {})}
      themeMode={themes[currentTheme]?.dark ? 'dark' : 'light'}
      cssVars
    >
      {isLoading && (
        <Main justify="center" align="center">
          <Spinner size={48} />
        </Main>
      )}

      {!isLoading && (
        <>
          <Navbar />

          <AppNotification />

          <Switch>
            <Route exact path={ROUTES.ROOT} component={Root} />

            <Route path={ROUTES.SIGNIN} component={SignIn} />

            <Route path={ROUTES.SIGNUP} component={SignUp} />

            <Route path={ROUTES.ACCOUNT} component={Account} />

            <Route path={ROUTES.LEADERBOARD} component={Leaderboard} />

            <Route path={ROUTES.FORUM_TOPIC} component={ForumTopic} />

            <Route path={ROUTES.FORUM} component={Forum} />

            <Route path={ROUTES.GAME_LEVELS} component={GameLevels} />

            <Route path={ROUTES.GAME_OVER} component={GameOver} />

            <Route path={ROUTES.GAME} component={Game} />
          </Switch>
        </>
      )}
    </Grommet>
  );
};
