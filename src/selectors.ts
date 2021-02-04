import { RootState } from './store';

export const getAppState = (state: RootState) => state.app;

export const getTest = (state: RootState) => getAppState(state).test;
