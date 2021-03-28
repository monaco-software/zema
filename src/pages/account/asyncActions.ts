import { AppThunk } from '@store/store';
import { asyncAppActions } from '@store/asyncActions';
import {
  apiUpdateAvatar,
  apiUpdatePassword,
  apiUpdateProfile,
} from '@api/methods';
import {
  UpdateAvatarParams,
  UpdatePasswordParams,
  UpdateProfileParams,
} from '@api/schema';

export const asyncAccountActions = {
  updateProfile: (
    params: UpdateProfileParams
  ): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      await dispatch(apiUpdateProfile(params, false));
      await dispatch(asyncAppActions.fetchUser());
    } catch (error) {
      throw error;
    }
  },

  updateAvatar: (params: UpdateAvatarParams): AppThunk<Promise<void>> => async (
    dispatch
  ) => {
    try {
      await dispatch(apiUpdateAvatar(params, false));
      await dispatch(asyncAppActions.fetchUser());
    } catch (error) {
      throw error;
    }
  },

  updatePassword: (
    params: UpdatePasswordParams
  ): AppThunk<Promise<void>> => async (dispatch) => {
    await dispatch(apiUpdatePassword(params, false));
  },
};
