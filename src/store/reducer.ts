import { AppState } from '@common/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppState = {
  user: {
    id: 0,
    login: '',
    email: '',
    first_name: '',
    second_name: '',
    display_name: null,
    avatar: null,
    phone: '',
  },
  isSignedIn: false,
  notification: null,
  isSSR: false,
  themes: { 1: { id: 1, name: 'dummy', data: {}, dark: false, icon: '' } },
  currentTheme: 1,
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<AppState['user']>) {
      state.user = payload;
    },
    resetUser(state) {
      state.user = initialState.user;
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
