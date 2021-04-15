import './app.css';
import b_ from 'b_';
import React, { FC, useEffect, useState } from 'react';
import { Game } from '@pages/game/Game';
import { Grommet, Main } from 'grommet';
import { Root } from '@pages/root/Root';
import { Navbar } from '../Navbar/Navbar';
import { useSelector } from 'react-redux';
import { ROUTES } from '@common/constants';
import { getIsSSR } from '@store/selectors';
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
import { Switch, Route, useHistory } from 'react-router-dom';
import { Leaderboard } from '@pages/leaderboard/Leaderboard';
import { ForumTopic } from '@pages/forum/ForumTopic/ForumTopic';
import { AppNotification } from '../Notification/AppNotification';

const block = b_.lock('app');

const onLoad = () => {
  if (process.env.NODE_ENV === 'production') {
<<<<<<< HEAD
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.info('SW registered: ', registration);
    }).catch((error) => {
      console.error('SW registration failed: ', error);
    });
=======
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.info('SW registered: ', registration);
      })
      .catch((error) => {
        console.error('SW registration failed: ', error);
      });
>>>>>>> dev
  }
};

export const App: FC = () => {
  const history = useHistory();

  const isSSR = useSelector(getIsSSR);

  const fetchUser = useAsyncAction(asyncAppActions.fetchUser);

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

    fetchUser().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    fetchUser()
      .finally(() => setIsLoading(false));
=======
>>>>>>> dev
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', onLoad);
    }
    return () => {
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <Grommet className={block()} theme={grommetTheme} cssVars>
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
