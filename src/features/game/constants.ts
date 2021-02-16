export const BALL_RADIUS = 15;
export const BALL_DIAMETER = BALL_RADIUS * 2;
export const FROG_RADIUS = 50;
export const SKULL_RADIUS = 52;
export const BULLET_START_POSITION = 0;
export const BULLET_ARMED_POSITION = 18;
export const COMBO_DISPLAY_PHASES = 16;
export const BLACKOUT_INCREMENT = 4;

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

export enum FRAME {
  WIDTH = 800,
  HEIGHT = 600,
}

export enum GAME_RESULT {
  WIN,
  FAIL
}

