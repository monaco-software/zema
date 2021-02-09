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

export interface RemainingColorsState {
  colors: number[];
}

export interface Point {
  x: number;
  y: number;
}

export interface Level {
  speed: number;
  balls: number;
  ballsTypes: number;
  frogPosition: Point;
  skullPosition: Point;
  start: number[];
  curve: number[][];
}
