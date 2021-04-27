import { AppState } from '@common/types';
import { UserObject } from '@api/schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const defaultUserObject = {
  id: 0,
  login: '',
  email: '',
  first_name: '',
  second_name: '',
  display_name: null,
  avatar: null,
  phone: '',
};

const initialState: AppState = {
  currentUserId: 0,
  users: {},
  isSignedIn: false,
  notification: null,
  isSSR: false,
  themes: { 1: { id: 1, name: 'dummy', data: {}, dark: false, icon: '' } },
  currentTheme: 1,
};

interface SetUserPayload {
  id: number;
  user: UserObject;
}

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<SetUserPayload>) {
      state.users[payload.id] = payload.user;
    },
    setUserMany(state, { payload }: PayloadAction<UserObject[]>) {
      payload.forEach((user) => {
        state.users[user.id] = user;
      });
    },
    resetUsers(state) {
      state.users = {};
    },
    setCurrentUserId(state, { payload }: PayloadAction<number>) {
      state.currentUserId = payload;
    },
    setCurrentUser(state, { payload }: PayloadAction<UserObject>) {
      state.currentUserId = payload.id;
      state.users[payload.id] = payload;
    },
    setIsSignedIn(state, { payload }: PayloadAction<AppState['isSignedIn']>) {
      state.isSignedIn = payload;
    },
    setNotification(
      state,
      { payload }: PayloadAction<AppState['notification']>
    ) {
      state.notification = payload;
    },
    setIsSSR(state, { payload }: PayloadAction<AppState['isSSR']>) {
      state.isSSR = payload;
    },
    addTheme(state, { payload }) {
      state.themes[payload.id] = payload;
    },
    setCurrentTheme(
      state,
      { payload }: PayloadAction<AppState['currentTheme']>
    ) {
      state.currentTheme = payload;
    },
  },
});

export const appActions = app.actions;
export const appReducer = app.reducer;
