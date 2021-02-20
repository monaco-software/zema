export const BULLET_SPEED = 40;
export const BULLET_TICK_DISTANCE = 15;
export const ALLOWANCE = 7;
export const SCORE_FONT_SIZE = 35;
export const COMBO_FONT_SIZE = 35;
export const TITLE_FONT_SIZE = 50;
export const BALL_EXPLODE_TIMEOUT = 300;
export const DEFAULT_FRAMERATE = 24;

export enum GAME_PHASE_TIMEOUTS {
  LOADED = 3000,
  STARTING = 2000,
  STARTED = 1000,
  ENDING = 2000,
  ENDED = 3000,
  EXITING = 1000
}

export enum MESSAGES {
  WIN = 'You are a WINNER',
  FAIL = 'You are a looser'
}
