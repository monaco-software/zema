import { createApiMethod, HTTP_METHODS } from './core';
import { API_PATH, getFullPath, getProxyPath } from '@server/router/paths';
import {
  CreateForumMessageParams,
  CreateForumMessageResponse,
  CreateForumTopicParams,
  CreateForumTopicResponse,
  GetForumMessagesResponse,
  GetForumTopicResponse,
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
  UpdateThemeParams,
  UpdateThemeResponse,
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
  getProxyPath(API_PATH.AUTH_LOGOUT),
  {
    method: HTTP_METHODS.POST,
    credentials: 'include',
  }
);

export const apiOAuthYandexGetServiceId = createApiMethod<
  undefined,
  OAuthYandexGetServiceIdResponse
>(getFullPath(API_PATH.OAUTH_YANDEX_SERVICE_ID), {
  method: HTTP_METHODS.GET,
});

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

export const apiUpdateTheme = createApiMethod<
  UpdateThemeParams,
  UpdateThemeResponse
>(API_PATH.USER_THEME, {
  method: HTTP_METHODS.PUT,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiGetForumTopics = createApiMethod<
  undefined,
  GetForumTopicResponse
>(API_PATH.FORUM_TOPICS, {
  method: HTTP_METHODS.GET,
  credentials: 'include',
});

export const apiCreateForumTopic = createApiMethod<
  CreateForumTopicParams,
  CreateForumTopicResponse
>(API_PATH.FORUM_TOPICS, {
  method: HTTP_METHODS.POST,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiGetForumTopicMessages = (topicId: number) =>
  createApiMethod<undefined, GetForumMessagesResponse>(
    `${API_PATH.FORUM_MESSAGES}?topicId=${topicId}`,
    {
      method: HTTP_METHODS.GET,
      credentials: 'include',
    }
  );

export const apiCreateForumMessage = createApiMethod<
  CreateForumMessageParams,
  CreateForumMessageResponse
>(API_PATH.FORUM_MESSAGES, {
  method: HTTP_METHODS.POST,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});
