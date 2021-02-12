export const BALL_RADIUS = 15;
export const FROG_RADIUS = 50;
export const SKULL_RADIUS = 52;
export const BULLET_SPEED = 9;
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
}

export enum SHOT_STATE {
  IDLE,
  FLYING
}

export enum GAME_PHASE {
  IDLE,
  STARTING,
  STARTED,
  ENDING,
  ENDED
}

export enum FRAME {
  WIDTH = 800,
  HEIGHT = 600,
}
