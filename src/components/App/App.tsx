import './App.css';
import React, { FC } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Login } from '../../features/login/Login';
import { Forum } from '../../features/forum/Forum';
import { useDispatch, useSelector } from 'react-redux';
import { getTest } from '../../selectors';
import { appActions } from '../../reducer';

export const App: FC = () => {
  const dispatch = useDispatch();

  const test = useSelector(getTest);

  const updateTest = () => dispatch(appActions.setTest(Math.random()));

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <div className="App__test">
            {test}
            <br />
            <button onClick={updateTest}>
              Set random test state
            </button>
          </div>
          <br />

          <Link to="/login">Login page</Link>
          <br />
          <Link to="/forum">Forum page</Link>
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/forum">
          <Forum />
        </Route>
      </Switch>
    </div>
  );
};
