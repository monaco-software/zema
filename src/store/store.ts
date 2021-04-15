import { appReducer } from './reducer';
import { gameReducer } from '@pages/game/reducer';
import { forumReducer } from '@pages/forum/reducer';
import { gameLevelsReducer } from '@pages/gameLevels/reducer';
import { leaderboardReducer } from '@pages/leaderboard/reducer';
import {
  Action,
  combineReducers,
  configureStore,
  DeepPartial,
  ThunkAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';

const reducer = combineReducers({
  app: appReducer,
  game: gameReducer,
  leaderboard: leaderboardReducer,
  gameLevels: gameLevelsReducer,
  forum: forumReducer,
});

export const createStore = (preloadedState?: DeepPartial<RootState>) => {
  return configureStore({
    reducer,
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type RootState = ReturnType<typeof reducer>;
export type Dispatch = ThunkDispatch<RootState, unknown, Action>;
export type AppThunk<R> = ThunkAction<R, RootState, unknown, Action<string>>;
