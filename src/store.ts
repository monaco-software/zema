import { Action, combineReducers, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { appReducer } from './reducer';
import { accountReducer } from './features/account/reducer';
import { bulletReducer, remainingColorsReducer } from './features/game/reducer';

const reducer = combineReducers({
  app: appReducer,
  account: accountReducer,
  bullet: bulletReducer,
  remainingColors: remainingColorsReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof reducer>;
export type Dispatch = ThunkDispatch<RootState, unknown, Action>;
export type AppThunk<R> = ThunkAction<R, RootState, unknown, Action<string>>;
