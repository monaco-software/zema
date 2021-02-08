import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../common/types';

const initialState: AppState = {
  test: 'test string',
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTest(state, { payload }: PayloadAction<AppState['test']>) {
      state.test = payload;
    },
  },
});

export const appActions = app.actions;
export const appReducer = app.reducer;
