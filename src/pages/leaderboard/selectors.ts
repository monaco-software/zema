import { RootState } from '@store/store';
import { createSelector } from '@reduxjs/toolkit';

const getLeaderboardState = (state: RootState) => state.leaderboard;

export const getLeaderboardRecords = createSelector(
  getLeaderboardState,
  (state) => state.records
);
