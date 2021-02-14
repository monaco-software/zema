import './app.css';
import React, { FC } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTest } from '../../store/selectors';
import { appActions } from '../../store/reducer';
import { ROUTES } from '../../common/constants';
import { SignIn } from '../../features/signin/SignIn';
import { Forum } from '../../features/forum/Forum';
import { SignUp } from '../../features/signup/SignUp';
import { Account } from '../../features/account/Account';
import { Leaderboard } from '../../features/leaderboard/Leaderboard';
import { Game } from '../../features/game/Game';
import { GameLevels } from '../../features/gameLevels/GameLevels';
import { GameOver } from '../../features/gameOver/GameOver';
import { useAction } from '../../hooks';
import { Navbar } from '../Navbar/Navbar';
import b_ from 'b_';
import { grommet, Grommet } from 'grommet';

const block = b_.lock('app');

export const App: FC = () => {
  const setTest = useAction(appActions.setTest);

  const test = useSelector(getTest);

  const updateTest = () => setTest(Math.random());

  return (
    <Grommet className={block()} theme={grommet} cssVars>
      <Navbar />

      <Switch>
        {/* Главная страница */}
        <Route exact path="/">
          <div className={block('test')}>
            {test}
            <br />
            <button onClick={updateTest}>
              Set random test state
            </button>
          </div>
          <br />

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
    </Grommet>
  );
};
