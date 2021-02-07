import { RootState } from './store';

const getAppState = (state: RootState) => state.app;

export const getTest = (state: RootState) => getAppState(state).test;
