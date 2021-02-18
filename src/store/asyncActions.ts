import { getUserWithFullAvatarUrl } from '../common/helpers';
import { AppThunk } from './store';
import {
  apiGetLeaderboard,
  apiGetUser,
  apiGetUserById,
  apiPerformSignIn,
  apiPerformSignUp,
  apiUpdateLeaderboard,
} from '../api/methods';
import { appActions } from './reducer';
import { GetLeaderboardParams, SignInParams, SignUpParams, UpdateLeaderboardParams } from '../api/schema';
import { getCurrentUser } from './selectors';
import { LEADERBOARD_VALUE_FIELD_NAME } from '../pages/leaderboard/constants';
import { leaderboardActions } from '../pages/leaderboard/reducer';
import { LeaderboardRecord } from '../pages/leaderboard/types';

export const asyncAppActions = {
  fetchUser: (): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      const user = await dispatch(apiGetUser(undefined, false));
      const userWithFullAvatarUrl = getUserWithFullAvatarUrl(user);

      dispatch(appActions.setUser(userWithFullAvatarUrl));
      dispatch(appActions.setIsSignedIn(true));
    } catch (error) {
      throw error;
    }
  },

  signInUser: (params: SignInParams): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      await dispatch(apiPerformSignIn(params, false));
      await dispatch(asyncAppActions.fetchUser());
    } catch (error) {
      throw error;
    }
  },

  signUpUser: (params: SignUpParams): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      await dispatch(apiPerformSignUp(params, false));
      await dispatch(asyncAppActions.fetchUser());
    } catch (error) {
      throw error;
    }
  },

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

