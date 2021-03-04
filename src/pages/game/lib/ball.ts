import Sprite from './sprite';
import ballSprite from '../assets/images/balls.png';
import { random } from './utils';
import { BALL_DIAMETER } from '../constants';

export default class Ball extends Sprite {
  protected _color = 0;
  protected _rotationOffset = 0;

  protected static instance: Ball;

  static readonly amountOfColors = 6;
  static readonly amountOfFrames = 60;
  static readonly yOffset = 180;

  static index: number[];
  static buffer: HTMLCanvasElement[];

  static updateTime = 0;
  static updates = 0;

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
    // всегда должен быть хотябы один шар
    if (!Ball.instance) {
      Ball.instance = this;
      const len = Ball.amountOfColors * Ball.amountOfFrames;
      Ball.index = Array(len).fill(0);
      Ball.buffer = Array(len).fill(0).map(() => {
        const canvas = document.createElement('canvas');
        canvas.width = BALL_DIAMETER;
        canvas.height = BALL_DIAMETER;
        return canvas;
      });
    }
    this._color = color;
    this.rotationOffset = positionOffset;
    this.image = new Image();
    this.image.src = ballSprite;
  }

  updateBuffer(index: number, bufferIndex: number) {
    // если не закэшировано - рендерим и пишем в кэш
    super.update(index, 0);
    const bufferCtx = Ball.buffer[bufferIndex].getContext('2d');
    if (!bufferCtx) {
      throw new Error('Cant update buffer canvas');
    }
    bufferCtx.drawImage(
      this.canvas,
      0, 0,
      this.width,
      this.height,
      0, 0,
      this.width,
      this.height
    );
    Ball.index[bufferIndex] += 1;
  }

  getBuffer(index: number): HTMLCanvasElement | undefined {
    if (!this.image.width) {
      return;
    }
    let frame = index % this.numberOfFrames;
    if (frame < 0) {
      return;
    }

    const bufferIndex = this.color * this.numberOfFrames + frame;
    const notCached = Ball.index[bufferIndex] === 0;
    if (notCached) {
      this.updateBuffer(index, bufferIndex);
    }
    return Ball.buffer[bufferIndex];
  }

  update(index = 0, angle = 0) {
    if (!this.image.width) {
      return;
    }
    let frame = index % this.numberOfFrames;
    if (frame < 0) {
      return;
    }

    const bufferIndex = this.color * this.numberOfFrames + frame;
    const notCached = Ball.index[bufferIndex] === 0;

    if (notCached) {
      this.updateBuffer(index, bufferIndex);
    }
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.rotate(angle);
    this.ctx.translate(-this.width / 2, -this.height / 2);
    this.ctx.drawImage(
      Ball.buffer[bufferIndex],
      0, 0,
      this.width,
      this.height,
      0, 0,
      this.width,
      this.height
    );
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    Ball.index[bufferIndex] += 1;
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
