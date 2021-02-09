import { Action, combineReducers, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { appReducer } from './reducer';
import { accountReducer } from '../features/account/reducer';
import { gameReducer } from '../features/game/reducer';

const reducer = combineReducers({
  app: appReducer,
  account: accountReducer,
  game: gameReducer,
});

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = ThunkDispatch<RootState, unknown, Action>;
export type AppThunk<R> = ThunkAction<R, RootState, unknown, Action<string>>;
