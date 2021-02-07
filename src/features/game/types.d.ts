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

