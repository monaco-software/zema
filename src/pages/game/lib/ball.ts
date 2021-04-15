import Sprite from './sprite';
import ballSprite from '../assets/images/balls.webp';
import { random } from './utils';
import { BALL_DIAMETER } from '../constants';

export default class Ball extends Sprite {
  protected _color = 0;
  protected _rotationOffset = 0;

  protected static instance: Ball;

  static readonly amountOfColors = 6;
  static readonly amountOfFrames = 60;
  static readonly yOffset = 180;

  static cached: boolean[];
  static buffer: HTMLCanvasElement[];

  static updateTime = 0;
  static updates = 0;

  static image: HTMLImageElement;

  position = 0;
  acceleration = 0;

  constructor(
    color = random(Ball.amountOfColors),
    positionOffset = random(Ball.amountOfFrames)
  ) {
    super({
      yOffset: color * Ball.yOffset,
      numberOfFrames: Ball.amountOfFrames,
      width: BALL_DIAMETER,
      height: BALL_DIAMETER,
    });
    if (!Ball.instance) {
      Ball.instance = this;
      const len = Ball.amountOfColors * Ball.amountOfFrames;
      Ball.cached = Array(len).fill(false);
      Ball.buffer = Array(len)
        .fill(0)
        .map(() => {
          const canvas = document.createElement('canvas');
          canvas.width = BALL_DIAMETER;
          canvas.height = BALL_DIAMETER;
          return canvas;
        });
      Ball.image = new Image();
      Ball.image.src = ballSprite;
    }
    this._color = color;
    this.rotationOffset = positionOffset;
    this.image = Ball.image;
  }

  private updateBuffer(index: number, bufferIndex: number) {
    // если не закэшировано - рендерим и пишем в кэш
    super.update(index, 0);
    const bufferCtx = Ball.buffer[bufferIndex].getContext('2d');
    if (!bufferCtx) {
      throw new Error('Cant update buffer canvas');
    }
    bufferCtx.drawImage(
      this.canvas,
      0,
      0,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    );
    Ball.cached[bufferIndex] = true;
  }

  getBuffer(index: number): HTMLCanvasElement | undefined {
    let frame = index % this.numberOfFrames;
    if (frame < 0 || !this.image.width) {
      return;
    }
    const bufferIndex = this.color * this.numberOfFrames + frame;
    if (!Ball.cached[bufferIndex]) {
      this.updateBuffer(index, bufferIndex);
    }
    return Ball.buffer[bufferIndex];
  }

  update(index = 0, angle = 0) {
    let frame = index % this.numberOfFrames;
    if (frame < 0 || !this.image.width) {
      return;
    }
    const bufferIndex = this.color * this.numberOfFrames + frame;
    if (!Ball.cached[bufferIndex]) {
      this.updateBuffer(index, bufferIndex);
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.rotate(angle);
    this.ctx.translate(-this.width / 2, -this.height / 2);
    this.ctx.drawImage(
      Ball.buffer[bufferIndex],
      0,
      0,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    );
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  get color() {
    return this._color;
  }

  set color(newColor) {
    if (newColor < 0 || newColor > Ball.amountOfColors) {
      return;
    }
    this._color = newColor;
    this.yOffset = this._color * Ball.yOffset;
  }

  get rotationOffset(): number {
    return this._rotationOffset;
  }

  set rotationOffset(offset: number) {
    let naturalOffset = offset;
    while (naturalOffset < 0) {
      naturalOffset += this.numberOfFrames;
    }
    this._rotationOffset = naturalOffset;
  }
}
