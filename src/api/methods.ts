import { createApiMethod, HTTP_METHODS } from './core';
import {
  GetLeaderboardParams,
  GetLeaderboardResponse,
  SignInParams,
  SignInResponse,
  SignOutResponse,
  SignUpParams,
  SignUpResponse, UpdateAvatarParams, UpdateAvatarResponse,
  UpdateLeaderboardParams,
  UpdateLeaderboardResponse, UpdatePasswordParams, UpdatePasswordResponse, UpdateProfileParams, UpdateProfileResponse,
  UserObject,
} from './schema';

export const YANDEX_API_URL = 'https://ya-praktikum.tech';
const getFullPath = (path: string) => `${YANDEX_API_URL}/api/v2${path}`;

export const apiGetUser = createApiMethod<undefined, UserObject>(
  getFullPath('/auth/user'),
  {
    method: HTTP_METHODS.GET,
    credentials: 'include',
  }
);

export const apiPerformSignIn = createApiMethod<SignInParams, SignInResponse>(
  getFullPath('/auth/signin'),
  {
    method: HTTP_METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const apiPerformSignUp = createApiMethod<SignUpParams, SignUpResponse>(
  getFullPath('/auth/signup'),
  {
    method: HTTP_METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const apiPerformSignOut = createApiMethod<undefined, SignOutResponse>(
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
  {
    method: HTTP_METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const apiGetLeaderboard = createApiMethod<GetLeaderboardParams, GetLeaderboardResponse>(
  getFullPath('/leaderboard/all'),
  {
    method: HTTP_METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const apiUpdateProfile = createApiMethod<UpdateProfileParams, UpdateProfileResponse>(
  getFullPath('/user/profile'),
  {
    method: HTTP_METHODS.PUT,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const apiUpdateAvatar = createApiMethod<UpdateAvatarParams, UpdateAvatarResponse>(
  getFullPath('/user/profile/avatar'),
  {
    method: HTTP_METHODS.PUT,
    credentials: 'include',
  }
);

export const apiUpdatePassword = createApiMethod<UpdatePasswordParams, UpdatePasswordResponse>(
  getFullPath('/user/password'),
  {
    method: HTTP_METHODS.PUT,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
