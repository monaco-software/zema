export enum ROUTES {
  ROOT = '/',
  SIGNIN = '/signin',
  SIGNUP = '/signup',
  ACCOUNT = '/account',
  LEADERBOARD = '/leaderboard',
  FORUM = '/forum',
  FORUM_TOPIC = '/forum/:topicId',
  GAME = '/game',
  GAME_LEVELS = '/game/levels',
  GAME_OVER = '/game/over',
}

export type RouteParams = Partial<{
  topicId: string;
}>;
