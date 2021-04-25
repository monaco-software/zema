import { AppThunk } from './store';
import { appActions } from './reducer';
import { Themes } from '@common/types';
import { getUserWithFullAvatarUrl } from '@common/helpers';
import {
  GetUserThemeParams,
  SignInParams,
  SignUpParams,
  UpdateThemeParams,
} from '@api/schema';
import {
  apiGetThemes,
  apiGetUser,
  apiGetUserTheme,
  apiOAuthYandexGetServiceId,
  apiPerformSignIn,
  apiPerformSignOut,
  apiPerformSignUp,
  apiUpdateUserTheme,
} from '@api/methods';

export const asyncAppActions = {
  fetchUser: (): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      const user = await dispatch(apiGetUser(undefined, false));
      const userWithFullAvatarUrl = getUserWithFullAvatarUrl(user);

      dispatch(appActions.setCurrentUser(userWithFullAvatarUrl));
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

      dispatch(appActions.resetUsers());
      dispatch(appActions.setIsSignedIn(false));
    } catch (error) {
      throw error;
    }
  },

  oAuthYandexStart: (): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      const response = await dispatch(apiOAuthYandexGetServiceId());

      // eslint-disable-next-line max-len
      window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${response.service_id}&redirect_uri=${window.location.origin}`;
    } catch (error) {
      throw error;
    }
  },

  setUserTheme: (params: UpdateThemeParams): AppThunk<Promise<void>> => async (
    dispatch
  ) => {
    try {
      dispatch(appActions.setCurrentTheme(params.themeId));
      dispatch(apiUpdateUserTheme(params)).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  fetchUserTheme: (
    params: GetUserThemeParams
  ): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      const { themeId } = await dispatch(
        apiGetUserTheme(params.userId)(undefined, false)
      );
      dispatch(appActions.setCurrentTheme(themeId));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  fetchThemes: (): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      const themes = (await dispatch(apiGetThemes())) as Themes[];
      themes.forEach((theme: any) => {
        dispatch(appActions.addTheme(theme));
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
