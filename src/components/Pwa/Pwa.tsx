import React, { FC, useEffect } from 'react';
import { Grommet } from 'grommet';
import { Game } from '@pages/game/Game';
import { Root } from '@pages/root/Root';
import { ROUTES } from '@common/constants';
import { Route, Switch } from 'react-router-dom';
import { grommetTheme } from '../App/grommetTheme';
import { GameOver } from '@pages/gameOver/GameOver';
import { GameLevels } from '@pages/gameLevels/GameLevels';

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

export const Pwa: FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', onLoad);
    }
    return () => {
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <Grommet style={{ height: '100%' }} theme={grommetTheme} cssVars>
      <Switch>
        <Route exact path={ROUTES.ROOT} component={Root} />

        <Route path={ROUTES.GAME_LEVELS} component={GameLevels} />

        <Route path={ROUTES.GAME_OVER} component={GameOver} />

        <Route path={ROUTES.GAME} component={Game} />
      </Switch>
    </Grommet>
  );
};
