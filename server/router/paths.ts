export const YANDEX_API_DOMAIN = 'https://ya-praktikum.tech';

export const YANDEX_API_URL = `${YANDEX_API_DOMAIN}/api/v2`;

export const YANDEX_API_PROXY_PREFIX = '/yaApiProxy';

export const getFullPath = (path: string) => {
  return `${YANDEX_API_URL}${path}`;
};

export const getFullPathFromProxy = (proxyPath: string) => {
  const path = proxyPath.replace(YANDEX_API_PROXY_PREFIX, '');
  return `${YANDEX_API_URL}${path}`;
};

export const getProxyPath = (path: string) => {
  return `${YANDEX_API_PROXY_PREFIX}${path}`;
};

export const API_PATH = {
  AUTH_USER: '/auth/user',
  AUTH_SIGNIN: '/auth/signin',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_LOGOUT: '/auth/logout',

  OAUTH_YANDEX_SERVICE_ID: '/oauth/yandex/service-id',
  OAUTH_YANDEX_SIGN_IN: '/oauth/yandex',

  USER_PROFILE: '/user/profile',
  USER_PROFILE_AVATAR: '/user/profile/avatar',
  USER_AVATAR_SRC: '/resources',
  USER_PASSWORD: '/user/password',
  USER_BY_ID: '/user',

  LEADERBOARD_ALL: '/leaderboard/all',
  LEADERBOARD_UPDATE: '/leaderboard',

  THEMES: '/api/themes',
  USER_THEME: '/api/user/theme',

  FORUM_TOPICS: '/api/forum/topics',
  FORUM_MESSAGES: '/api/forum/topic/messages',
} as const;
