import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeaderboardState } from './types';

const initialState: LeaderboardState = {
  records: [],
};

const leaderboard = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setRecords(state, { payload }: PayloadAction<LeaderboardState['records']>) {
      state.records = payload;
    },
  },
});

export const leaderboardActions = leaderboard.actions;
export const leaderboardReducer = leaderboard.reducer;
