import { LeaderboardRecordObject, UserObject } from '../../api/schema';
import { LEADERBOARD_VALUE_FIELD_NAME } from './constants';

export interface LeaderboardRecord extends UserObject, Omit<LeaderboardRecordObject, 'user_id' | typeof LEADERBOARD_VALUE_FIELD_NAME> {
  points: LeaderboardRecordObject[typeof LEADERBOARD_VALUE_FIELD_NAME];
  timestamp: LeaderboardRecordObject['timestamp'];
}

export interface LeaderboardState {
  records: LeaderboardRecord[];
}
