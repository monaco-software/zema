import { RootState } from './store';

const getAppState = (state: RootState) => state.app;

export const getIsSignedInd = (state: RootState) => getAppState(state).isSignedIn;
