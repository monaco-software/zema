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
  title: string;
  speed: number;
  balls: number;
  ballColors: number[];
  frogPosition: Point;
  skullPosition: Point;
  start: number[];
  curve: number[][];
  rollOut: number;
}

export interface Physics {
  pusherOffset: number;
  impacts: number[];
}
