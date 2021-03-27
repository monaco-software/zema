import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';

const getAppState = (state: RootState) => state.app;

export const getCurrentUser = createSelector(
  getAppState,
  (state) => state.user,
);

export const getIsSignedInd = createSelector(
  getAppState,
  (state) => state.isSignedIn,
);

export const getAppNotification = createSelector(
  getAppState,
  (state) => state.notification,
);

export const getIsSSR = createSelector(
  getAppState,
  (state) => state.isSSR,
);
