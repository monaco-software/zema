import './app.css';
import React, { FC, useEffect, useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { ROUTES } from '../../common/constants';
import { SignIn } from '../../features/signin/SignIn';
import { Forum } from '../../features/forum/Forum';
import { SignUp } from '../../features/signup/SignUp';
import { Account } from '../../features/account/Account';
import { Leaderboard } from '../../features/leaderboard/Leaderboard';
import { Game } from '../../features/game/Game';
import { GameLevels } from '../../features/gameLevels/GameLevels';
import { GameOver } from '../../features/gameOver/GameOver';
import { Navbar } from '../Navbar/Navbar';
import b_ from 'b_';
import { Grommet, Main } from 'grommet';
import { Spinner } from '../Spinner/Spinner';
import { grommetTheme } from './grommetTheme';
import { asyncAppActions } from '../../store/asyncActions';
import { useAsyncAction } from '../../hooks';

const block = b_.lock('app');

export const App: FC = () => {
  const fetchUser = useAsyncAction(asyncAppActions.fetchUser);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser(undefined)
      .finally(() => setIsLoading(false));
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

          <Switch>
            {/* Главная страница */}
            <Route exact path={ROUTES.ROOT}>
              <ul style={{ margin: 0 }}>
                <li><Link to={ROUTES.SIGNIN}>SignIn page</Link></li>
                <li><Link to={ROUTES.SIGNUP}>SignUp page</Link></li>
                <li><Link to={ROUTES.ACCOUNT}>Account page</Link></li>
                <li><Link to={ROUTES.LEADERBOARD}>Leaderboard page</Link></li>
                <li><Link to={ROUTES.FORUM}>Forum page</Link></li>
                <li><Link to={ROUTES.GAME}>Game page</Link></li>
                <li><Link to={ROUTES.GAME_LEVELS}>GameLevels page</Link></li>
                <li><Link to={ROUTES.GAME_OVER}>GameOver page</Link></li>
              </ul>
            </Route>

            <Route path={ROUTES.SIGNIN} component={SignIn} />

            <Route path={ROUTES.SIGNUP} component={SignUp} />

            <Route path={ROUTES.ACCOUNT} component={Account} />

            <Route path={ROUTES.LEADERBOARD} component={Leaderboard} />

            <Route path={ROUTES.FORUM} component={Forum} />

            <Route exact path={ROUTES.GAME} component={Game} />

            <Route path={ROUTES.GAME_LEVELS} component={GameLevels} />

            <Route path={ROUTES.GAME_OVER} component={GameOver} />
          </Switch>
        </>
      )}
    </Grommet>
  );
};
