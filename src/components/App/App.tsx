import './App.css';
import React, { FC } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Login } from '../../features/login/Login';
import { Forum } from '../../features/forum/Forum';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
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
    </BrowserRouter>
  );
};
