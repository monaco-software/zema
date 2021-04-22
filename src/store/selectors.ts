import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';
import { defaultUserObject } from '@store/reducer';

const getAppState = (state: RootState) => state.app;

export const getUsers = createSelector(getAppState, (state) => state.users);

export const getCurrentUserId = createSelector(
  getAppState,
  (state) => state.currentUserId
);

export const getCurrentUser = createSelector(
  getUsers,
  getCurrentUserId,
  (users, currentUserId) => users[currentUserId] ?? defaultUserObject
);

export const getIsSignedInd = createSelector(
  getAppState,
  (state) => state.isSignedIn
);

export const getAppNotification = createSelector(
  getAppState,
  (state) => state.notification
);

export const getThemes = createSelector(getAppState, (state) => state.themes);

export const getCurrentTheme = createSelector(
  getAppState,
  (state) => state.currentTheme
);

export const getIsSSR = createSelector(getAppState, (state) => state.isSSR);
