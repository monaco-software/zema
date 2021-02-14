import { RootState } from '../../store/store';

const getLeaderboardState = (state: RootState) => state.leaderboard;

export const getLeaderboardRecords = (state: RootState) => getLeaderboardState(state).records;
