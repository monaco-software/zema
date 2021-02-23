import { Action, combineReducers, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { appReducer } from './reducer';
import { accountReducer } from '../pages/account/reducer';
import { gameReducer } from '../pages/game/reducer';
import { leaderboardReducer } from '../pages/leaderboard/reducer';
import { forumReducer } from '../pages/forum/reducer';

const reducer = combineReducers({
  app: appReducer,
  account: accountReducer,
  game: gameReducer,
  leaderboard: leaderboardReducer,
  forum: forumReducer,
});

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = ThunkDispatch<RootState, unknown, Action>;
export type AppThunk<R> = ThunkAction<R, RootState, unknown, Action<string>>;
