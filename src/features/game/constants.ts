export const BALL_RADIUS = 15;
export const FROG_RADIUS = 50;
export const SKULL_RADIUS = 52;
export const BULLET_SPEED = 15;
export const ALLOWANCE = 7;
export const BULLET_START_POSITION = 0;
export const BULLET_ARMED_POSITION = 20;

export enum BALL_COLORS {
  BLUE,
  YELLOW,
  GREEN,
  RED,
  PINK,
  GREY,
}

export enum BULLET_STATE {
  IDLE,
  ARMING,
  ARMED,
  SHOT,
  INSERTING
}

export enum GAME_PHASE {
  LOADING,
  LOADED,
  STARTING,
  STARTED,
  ENDING,
  ENDED,
  EXITING
}

export enum GAME_PHASE_TIMEOUTS {
  LOADED = 1500,
  STARTING = 2000,
  STARTED = 1000,
  ENDING = 2000,
  ENDED = 3000,
  EXITING = 1000
}

export enum FRAME {
  WIDTH = 800,
  HEIGHT = 600,
}

export enum GAME_RESULT {
  WIN,
  FAIL
}

export enum MESSAGES {
  WIN = 'You are a WINNER',
  FAIL = 'You are a looser'
}

