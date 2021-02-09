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
import b_ from 'b_';
import { grommet, Grommet, Main } from 'grommet';
import { Spinner } from '../Spinner';
import { apiGetUser } from '../../api/methods';
import { useAction } from '../../hooks';
import { appActions } from '../../store/reducer';

const block = b_.lock('app');

export const App: FC = () => {
  const setUser = useAction(appActions.setUser);
  const setIsSignedIn = useAction(appActions.setIsSignedIn);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiGetUser()
      .then((response) => {
        setUser(response);
        setIsSignedIn(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Grommet className={block()} theme={grommet}>
      {isLoading && (
        <Main justify="center" align="center">
          <Spinner size={48} />
        </Main>
      )}

      {!isLoading && (
        <Switch>
          {/* Главная страница */}
          <Route exact path={ROUTES.ROOT}>
            <ul>
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
      )}
    </Grommet>
  );
};
