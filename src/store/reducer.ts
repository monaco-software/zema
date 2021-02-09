import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../common/types';

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
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<AppState['user']>) {
      state.user = payload;
    },
    setIsSignedIn(state, { payload }: PayloadAction<AppState['isSignedIn']>) {
      state.isSignedIn = payload;
    },
  },
});

export const appActions = app.actions;
export const appReducer = app.reducer;
