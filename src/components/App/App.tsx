import './App.css';
import React, { FC } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTest } from '../../selectors';
import { appActions } from '../../reducer';
import { routes } from '../../constants';
import { SignIn } from '../../features/signin/SignIn';
import { Forum } from '../../features/forum/Forum';
import { SignUp } from '../../features/signup/SignUp';
import { Account } from '../../features/account/Account';
import { Leaderboard } from '../../features/leaderboard/Leaderboard';
import { Game } from '../../features/game/Game';
import { GameLevels } from '../../features/gameLevels/GameLevels';
import { GameOver } from '../../features/gameOver/GameOver';

export const App: FC = () => {
  const dispatch = useDispatch();

  const test = useSelector(getTest);

  const updateTest = () => dispatch(appActions.setTest(Math.random()));

  return (
    <div className="App">
      <Switch>
        {/* Главная страница */}
        <Route exact path="/">
          <div className="App__test">
            {test}
            <br />
            <button onClick={updateTest}>
              Set random test state
            </button>
          </div>
          <br />

          <ul>
            <li><Link to={routes.SIGNIN}>SignIn page</Link></li>
            <li><Link to={routes.SIGNUP}>SignUp page</Link></li>
            <li><Link to={routes.ACCOUNT}>Account page</Link></li>
            <li><Link to={routes.LEADERBOARD}>Leaderboard page</Link></li>
            <li><Link to={routes.FORUM}>Forum page</Link></li>
            <li><Link to={routes.GAME}>Game page</Link></li>
            <li><Link to={routes.GAME_LEVELS}>GameLevels page</Link></li>
            <li><Link to={routes.GAME_OVER}>GameOver page</Link></li>
          </ul>
        </Route>

        {/* Вход */}
        <Route path={routes.SIGNIN}>
          <SignIn />
        </Route>

        {/* Регистрация */}
        <Route path={routes.SIGNUP}>
          <SignUp />
        </Route>

        {/* Страница пользователя */}
        <Route path={routes.ACCOUNT}>
          <Account />
        </Route>

        {/* Лидерборд */}
        <Route path={routes.LEADERBOARD}>
          <Leaderboard />
        </Route>

        {/* Форум */}
        <Route path={routes.FORUM}>
          <Forum />
        </Route>

        {/* Игра */}
        <Route exact path={routes.GAME}>
          <Game />
        </Route>

        {/* Страница уровней */}
        <Route path={routes.GAME_LEVELS}>
          <GameLevels />
        </Route>

        {/* Завершение уровня */}
        <Route path={routes.GAME_OVER}>
          <GameOver />
        </Route>
      </Switch>
    </div>
  );
};
