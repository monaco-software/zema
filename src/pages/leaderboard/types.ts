import { LEADERBOARD_VALUE_FIELD_NAME } from './constants';
import { LeaderboardRecordObject, UserObject } from '@api/schema';

type PartialLeaderboardRecordObject = Omit<
  LeaderboardRecordObject,
  'user_id' | typeof LEADERBOARD_VALUE_FIELD_NAME
>;

export interface LeaderboardRecord
  extends UserObject,
    PartialLeaderboardRecordObject {
  points: LeaderboardRecordObject[typeof LEADERBOARD_VALUE_FIELD_NAME];
  timestamp: LeaderboardRecordObject['timestamp'];
}

export interface LeaderboardState {
  records: LeaderboardRecord[];
}
