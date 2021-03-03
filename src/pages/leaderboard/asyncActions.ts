import { AppThunk } from '@store/store';
import { LeaderboardRecord } from './types';
import { leaderboardActions } from './reducer';
import { getCurrentUser } from '@store/selectors';
import { LEADERBOARD_VALUE_FIELD_NAME } from './constants';
import { getUserWithFullAvatarUrl } from '@common/helpers';
import { GetLeaderboardParams, UpdateLeaderboardParams } from '@api/schema';
import { apiGetLeaderboard, apiGetUserById, apiUpdateLeaderboard } from '@api/methods';

export const asyncLeaderboardActions = {

  updateLeaderboard: (params: { points: number }): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const state = getState();
    const currentUser = getCurrentUser(state);
    const timestamp = Date.now();

    const requestParams: UpdateLeaderboardParams = {
      data: {
        [LEADERBOARD_VALUE_FIELD_NAME]: params.points,
        user_id: currentUser.id,
        timestamp,
      },
      ratingFieldName: LEADERBOARD_VALUE_FIELD_NAME,
    };

    try {
      await dispatch(apiUpdateLeaderboard(requestParams));
    } catch (error) {
      throw error;
    }
  },

  getLeaderboard: (params: { cursor: number; limit: number }): AppThunk<Promise<void>> => async (dispatch) => {
    const requestParams: GetLeaderboardParams = {
      ...params,
      ratingFieldName: LEADERBOARD_VALUE_FIELD_NAME,
    };

    try {
      const leaderboardRecords = await dispatch(apiGetLeaderboard(requestParams));

      const userIds = leaderboardRecords.map((item) => item.data.user_id);
      const getUserPromises = userIds.map((userId) => {
        const getUser = apiGetUserById(userId);
        return dispatch(getUser(undefined));
      });

      const users = await Promise.all(getUserPromises);

      const recordsWithUserData = leaderboardRecords.reduce((acc: LeaderboardRecord[], record, index) => {
        const user = users[index];

        if (!user || record.data.user_id !== user.id) {
          return acc;
        }

        const userWithFullAvatarUrl = getUserWithFullAvatarUrl(user);

        acc.push({
          ...userWithFullAvatarUrl,
          points: record.data[LEADERBOARD_VALUE_FIELD_NAME],
          timestamp: record.data.timestamp,
        });

        return acc;
      }, []);

      dispatch(leaderboardActions.setRecords(recordsWithUserData));
    } catch (error) {
      throw error;
    }
  },
};

