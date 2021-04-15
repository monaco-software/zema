import { BULLET_STATE } from '@pages/game/constants';

export interface spriteOptions {
  image: HTMLImageElement;
  frameIndex: number;
  numberOfFrames: number;
  yOffset: number;
  width: number;
  height: number;
  tick: number;
}

export interface BulletState {
  state: number;
  angle: number;
  color: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Level {
  title: string;
  speed: number;
  balls: number;
  ballColors: number[];
  frogPosition: Point;
  skullPosition: Point;
  scorePosition: Point;
  start: number[];
  curve: number[][];
  rollOut: number;
  background: string;
  thumbnail: string;
}

export interface Physics {
  pusherOffset: number;
  impacts: number[];
}

export interface GameButton {
  icon: string;
  x: number;
  y: number;
  hovered: boolean;
}

export interface Game {
  phase: number;
  bullet: {
    state: BULLET_STATE;
    color: number;
    angle: number;
    position: number;
  };
  remainColors: number[];
  currentLevel: number;
  openedLevel: number;
  explosion: number[];
  particle: number;
  pusher: number;
  shotPath: number[][];
  shotPosition: number;
  gameResult: number;
  title: string;
  score: number;
  combo: number;
  fullscreenState: boolean;
  fullscreenButton: GameButton;
  pauseButton: GameButton;
  muteState: boolean;
  muteButton: GameButton;
  volume: number;
  increaseVolumeButton: GameButton;
  decreaseVolumeButton: GameButton;
}
