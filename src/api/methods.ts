import {
  GetLeaderboardParams,
  GetLeaderboardResponse,
  SignInParams,
  SignInResponse,
  SignUpParams,
  SignUpResponse,
  UpdateLeaderboardParams,
  UpdateLeaderboardResponse,
  UserObject,
} from './schema';
import { createApiMethod } from './core';

export const YANDEX_API_URL = 'https://ya-praktikum.tech';
const getFullPath = (path: string) => `${YANDEX_API_URL}/api/v2${path}`;

export const apiGetUser = createApiMethod<undefined, UserObject>(
  getFullPath('/auth/user'),
  {
    method: 'GET',
    credentials: 'include',
  }
);

export const apiPerformSignIn = createApiMethod<SignInParams, SignInResponse>(
  getFullPath('/auth/signin'),
  {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const apiPerformSignUp = createApiMethod<SignUpParams, SignUpResponse>(
  getFullPath('/auth/signup'),
  {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const apiGetUserById = (userId: number) => createApiMethod<undefined, UserObject>(
  getFullPath(`/user/${userId}`),
  {
    method: 'GET',
    credentials: 'include',
  }
);

export const apiUpdateLeaderboard = createApiMethod<UpdateLeaderboardParams, UpdateLeaderboardResponse>(
  getFullPath('/leaderboard'),
  {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const apiGetLeaderboard = createApiMethod<GetLeaderboardParams, GetLeaderboardResponse>(
  getFullPath('/leaderboard/all'),
  {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
