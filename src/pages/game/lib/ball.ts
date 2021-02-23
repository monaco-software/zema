import Sprite from './sprite';
import { random } from './utils';
import { BALL_DIAMETER } from '../constants';

import ballSprite from '../assets/images/balls.png';

export default class Ball extends Sprite {
  protected _color = 0;
  protected _rotationOffset = 0;

  protected static instance: Ball;

  static index: number[];
  static buffer: HTMLCanvasElement[];

  static writeTime = 0;
  static readTime = 0;

  static updates = 0;
  static hits = 0;
  static writes = 0;

  position = 0;
  acceleration = 0;

  constructor(
    color = random(6),
    positionOffset = random(60)
  ) {
    super({ yOffset: color * 180, numberOfFrames: 60, width: BALL_DIAMETER, height: BALL_DIAMETER });
    // всегда должен быть хотябы один шар
    if (!Ball.instance) {
      Ball.instance = this;
      // Ball.index = [...Array(360 )].map(() => Array(Math.ceil(360 / Ball.divider)).fill(0));
      const len = 6 * 60;
      Ball.index = Array(len).fill(0);
      Ball.buffer = Array(len).fill(0).map(() => {
        const canvas = document.createElement('canvas');
        canvas.width = BALL_DIAMETER;
        canvas.height = BALL_DIAMETER;

        // const bufferCtx = canvas.getContext('2d');
        // if (!bufferCtx) { throw new Error('Cant write to buffer canvas'); }
        // bufferCtx.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
      });
    }
    this._color = color;
    this.rotationOffset = positionOffset;
    this.image = new Image();
    this.image.onload = () => {
      this.update(random(this.numberOfFrames), 0);
    };
    this.image.src = ballSprite;
  }

  update(index = 0, angle = 0) {
    if (!this.image.width ) { return; }
    Ball.updates += 1;
    let frame = index % this.numberOfFrames;
    if (frame < 0) {
      return;
    }
    // let degrees = toDegrees(angle);
    // while (degrees < 0) {
    //   degrees += 360;
    // }
    const start = performance.now();

    const bufferIndex = this.color * this.numberOfFrames + frame;
    const notCached = Ball.index[bufferIndex] === 0;

    if (notCached) {
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

    const now = performance.now();
    Ball.writes += 1;
    Ball.writeTime += now - start;

    Ball.hits += 1;
    Ball.readTime += now - start;

    Ball.index[bufferIndex] += 1;
  }

  get color() {
    return this._color;
  }

  set color(newColor) {
    if (typeof newColor === 'undefined' || newColor < 0 || newColor > 6) {
      return;
    }
    this._color = newColor;
    this.yOffset = this._color * 180;
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

  mapIndex(x: number, y: number, z: number, maxX: number, maxY: number, maxZ: number) {
    if (x > maxX || y > maxY || z > maxZ) {
      throw new Error('mapIndex: out of range');
    }
    return z * maxX * maxY + y * maxX + x;
  }
}
