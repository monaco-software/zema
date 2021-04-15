import { AppThunk } from './store';
import { appActions } from './reducer';
import { SignInParams, SignUpParams } from '@api/schema';
import { getUserWithFullAvatarUrl } from '@common/helpers';
import {
  apiGetUser,
  apiOAuthYandexGetServiceId,
  apiPerformSignIn,
  apiPerformSignOut,
  apiPerformSignUp,
} from '@api/methods';

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

  signInUser: (params: SignInParams): AppThunk<Promise<void>> => async (
    dispatch
  ) => {
    try {
      await dispatch(apiPerformSignIn(params, false));
      await dispatch(asyncAppActions.fetchUser());
    } catch (error) {
      throw error;
    }
  },

  signUpUser: (params: SignUpParams): AppThunk<Promise<void>> => async (
    dispatch
  ) => {
    try {
      await dispatch(apiPerformSignUp(params, false));
      await dispatch(asyncAppActions.fetchUser());
    } catch (error) {
      throw error;
    }
  },

  signOutUser: (): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      await dispatch(apiPerformSignOut());

      dispatch(appActions.resetUser());
      dispatch(appActions.setIsSignedIn(false));
    } catch (error) {
      throw error;
    }
  },

  oAuthYandexStart: (): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      const response = await dispatch(
        apiOAuthYandexGetServiceId(window.location.origin)()
      );

      // eslint-disable-next-line max-len
      window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${response.service_id}&redirect_uri=${window.location.origin}`;
    } catch (error) {
      throw error;
    }
  },
};
