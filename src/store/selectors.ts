import { RootState } from './store';

const getAppState = (state: RootState) => state.app;

export const getCurrentUser = (state: RootState) => getAppState(state).user;

export const getIsSignedInd = (state: RootState) => getAppState(state).isSignedIn;
