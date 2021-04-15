export const BALL_RADIUS = 15;
export const BALL_DIAMETER = BALL_RADIUS * 2;
export const FROG_RADIUS = 50;
export const SKULL_RADIUS = 52;
export const BLACKOUT_INCREMENT = 4;
export const MIN_VOLUME = 0;
export const MAX_VOLUME = 100;
export const VOLUME_STEP = 10;

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
  INSERTING,
}

export enum GAME_PHASE {
  LOADING,
  LOADED,
  STARTING,
  STARTED,
  PAUSED,
  ENDING,
  ENDED,
  EXITING,
}

export enum FRAME {
  WIDTH = 800,
  HEIGHT = 600,
}

export enum GAME_RESULT {
  UNKNOWN,
  WIN,
  FAIL,
}

export enum BUTTONS {
  FULLSCREEN,
}

export const LOCALSTORAGE_VOLUME = '__monaco-software-zooma_volume_key_v1__';
export const LOCALSTORAGE_MUTE = '__monaco-software-zooma_mute_key_v1__';
