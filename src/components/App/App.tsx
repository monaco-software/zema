import './app.css';
import React, { FC, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ROUTES } from '../../common/constants';
import { SignIn } from '../../pages/signin/SignIn';
import { Forum } from '../../pages/forum/Forum/Forum';
import { ForumTopic } from '../../pages/forum/ForumTopic/ForumTopic';
import { SignUp } from '../../pages/signup/SignUp';
import { Account } from '../../pages/account/Account';
import { Leaderboard } from '../../pages/leaderboard/Leaderboard';
import { Game } from '../../pages/game/Game';
import { GameLevels } from '../../pages/gameLevels/GameLevels';
import { GameOver } from '../../pages/gameOver/GameOver';
import { Navbar } from '../Navbar/Navbar';
import b_ from 'b_';
import { Grommet, Main } from 'grommet';
import { Spinner } from '../Spinner/Spinner';
import { grommetTheme } from './grommetTheme';
import { asyncAppActions } from '../../store/asyncActions';
import { useAsyncAction } from '../../hooks';
import { AppNotification } from '../Notification/AppNotification';
import { Landing } from '../../pages/landing/Landing';

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

          <AppNotification />

          <Switch>
            {/* Главная страница */}
            <Route exact path={ROUTES.ROOT} component={Landing} />
            {/*  <ul style={{ margin: 0 }}>*/}
            {/*    <li><Link to={ROUTES.SIGNIN}>SignIn page</Link></li>*/}
            {/*    <li><Link to={ROUTES.SIGNUP}>SignUp page</Link></li>*/}
            {/*    <li><Link to={ROUTES.ACCOUNT}>Account page</Link></li>*/}
            {/*    <li><Link to={ROUTES.LEADERBOARD}>Leaderboard page</Link></li>*/}
            {/*    <li><Link to={ROUTES.FORUM}>Forum page</Link></li>*/}
            {/*    <li><Link to={ROUTES.GAME}>Game page</Link></li>*/}
            {/*    <li><Link to={ROUTES.GAME_LEVELS}>GameLevels page</Link></li>*/}
            {/*    <li><Link to={ROUTES.GAME_OVER}>GameOver page</Link></li>*/}
            {/*  </ul>*/}
            {/* </Route>*/}

            <Route path={ROUTES.SIGNIN} component={SignIn} />

            <Route path={ROUTES.SIGNUP} component={SignUp} />

            <Route path={ROUTES.ACCOUNT} component={Account} />

            <Route path={ROUTES.LEADERBOARD} component={Leaderboard} />

            <Route path={ROUTES.FORUM_TOPIC} component={ForumTopic} />

            <Route path={ROUTES.FORUM} component={Forum} />

            <Route path={ROUTES.GAME_LEVELS} component={GameLevels} />

            <Route path={ROUTES.GAME} component={Game} />

            <Route path={ROUTES.GAME_OVER} component={GameOver} />
          </Switch>
        </>
      )}
    </Grommet>
  );
};
