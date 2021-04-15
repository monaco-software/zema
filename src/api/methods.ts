import { createApiMethod, HTTP_METHODS } from './core';
import { API_PATH, getFullPath, getProxyPath } from '@api/paths';
import {
  GetLeaderboardParams,
  GetLeaderboardResponse,
  OAuthYandexGetServiceIdResponse,
  SignInParams,
  SignInResponse,
  SignOutResponse,
  SignUpParams,
  SignUpResponse,
  UpdateAvatarParams,
  UpdateAvatarResponse,
  UpdateLeaderboardParams,
  UpdateLeaderboardResponse,
  UpdatePasswordParams,
  UpdatePasswordResponse,
  UpdateProfileParams,
  UpdateProfileResponse,
  UserObject,
} from './schema';

export const apiGetUser = createApiMethod<undefined, UserObject>(
  getProxyPath(API_PATH.AUTH_USER),
  {
    method: HTTP_METHODS.GET,
    credentials: 'include',
  }
);

export const apiPerformSignIn = createApiMethod<SignInParams, SignInResponse>(
  getProxyPath(API_PATH.AUTH_SIGNIN),
  {
    method: HTTP_METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const apiPerformSignUp = createApiMethod<SignUpParams, SignUpResponse>(
  getProxyPath(API_PATH.AUTH_SIGNUP),
  {
    method: HTTP_METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const apiPerformSignOut = createApiMethod<undefined, SignOutResponse>(
<<<<<<< HEAD
  getFullPath('/auth/logout'),
  {
    method: HTTP_METHODS.POST,
    credentials: 'include',
  }
);

export const apiGetUserById = (userId: number) => createApiMethod<undefined, UserObject>(
  getFullPath(`/user/${userId}`),
  {
    method: HTTP_METHODS.GET,
    credentials: 'include',
  }
);

export const apiUpdateLeaderboard = createApiMethod<UpdateLeaderboardParams, UpdateLeaderboardResponse>(
  getFullPath('/leaderboard'),
=======
  getProxyPath(API_PATH.AUTH_LOGOUT),
>>>>>>> dev
  {
    method: HTTP_METHODS.POST,
    credentials: 'include',
  }
);

export const apiOAuthYandexGetServiceId = (redirectUri: string) =>
  createApiMethod<undefined, OAuthYandexGetServiceIdResponse>(
    `${getFullPath(
      API_PATH.OAUTH_YANDEX_SERVICE_ID
    )}?redirect_uri=${redirectUri}`,
    {
      method: HTTP_METHODS.GET,
    }
  );

export const apiGetUserById = (userId: number) =>
  createApiMethod<undefined, UserObject>(
    `${getProxyPath(API_PATH.USER_BY_ID)}/${userId}`,
    {
      method: HTTP_METHODS.GET,
      credentials: 'include',
    }
  );

export const apiUpdateLeaderboard = createApiMethod<
  UpdateLeaderboardParams,
  UpdateLeaderboardResponse
>(getProxyPath(API_PATH.LEADERBOARD_UPDATE), {
  method: HTTP_METHODS.POST,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiGetLeaderboard = createApiMethod<
  GetLeaderboardParams,
  GetLeaderboardResponse
>(getProxyPath(API_PATH.LEADERBOARD_ALL), {
  method: HTTP_METHODS.POST,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiUpdateProfile = createApiMethod<
  UpdateProfileParams,
  UpdateProfileResponse
>(getProxyPath(API_PATH.USER_PROFILE), {
  method: HTTP_METHODS.PUT,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiUpdateAvatar = createApiMethod<
  UpdateAvatarParams,
  UpdateAvatarResponse
>(getProxyPath(API_PATH.USER_PROFILE_AVATAR), {
  method: HTTP_METHODS.PUT,
  credentials: 'include',
});

export const apiUpdatePassword = createApiMethod<
  UpdatePasswordParams,
  UpdatePasswordResponse
>(getProxyPath(API_PATH.USER_PASSWORD), {
  method: HTTP_METHODS.PUT,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});
