import Sprite from './sprite';
import { random } from './utils';
import { BALL_DIAMETER } from '../constants';
import { toDegrees, toRadians } from './geometry';

import ballSprite from '../assets/images/balls.png';

export default class Ball extends Sprite {
  protected _color = 0;
  protected _rotationOffset = 0;

  protected static instance: Ball;

  // делитель количества строк в кэше.
  // При 1 кэшируется каждый и 360 градусов
  // 360 / 2 = 180 и т.д.
  // чем больше тем заметнее углы на поворотах,
  // но меньше кэш и больше его эффективность
  // При 2 глазом почти незаметно
  static readonly divider = 2;

  static bufferCanvas: HTMLCanvasElement;
  static index = [...Array(360 )].map(() => Array(360 / Ball.divider).fill(0));
  static bufferCtx: CanvasRenderingContext2D;

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
    }
    if (!Ball.bufferCanvas) {
      Ball.bufferCanvas = document.createElement('canvas');
      Ball.bufferCanvas.width = BALL_DIAMETER * this.numberOfFrames * 6;
      Ball.bufferCanvas.height = BALL_DIAMETER * 360 / Ball.divider;
      if (!Ball.bufferCanvas) { throw new Error('cant create buffer canvas'); }
      Ball.bufferCtx = Ball.bufferCanvas.getContext('2d') as CanvasRenderingContext2D;
      if (!Ball.bufferCtx) { throw new Error('cant create buffer context'); }
    }
    this._color = color;
    this.rotationOffset = positionOffset;
    this.image = new Image();
    this.image.src = ballSprite;
    this.update(random(this.numberOfFrames), toRadians(random(360)));
  }

  update(index = 0, angle = 0) {
    Ball.updates += 1;
    let frame = index % this.numberOfFrames;
    if (frame < 0) {
      return;
    }
    let degrees = toDegrees(angle);
    while (degrees < 0) {
      degrees += 360;
    }
    const offset = Math.floor(degrees / Ball.divider);
    const statIndexX = this.color * this.numberOfFrames + frame;
    const statIndexY = offset;
    const x = BALL_DIAMETER * statIndexX;
    const y = BALL_DIAMETER * statIndexY;
    // если уже закэшировано - читаем
    if (Ball.index[statIndexX][statIndexY] > 0) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(
        Ball.bufferCanvas,
        x, y,
        this.width,
        this.height,
        0, 0,
        this.width,
        this.height
      );
      Ball.hits += 1;
    } else {
      // если нет - рендерим и пишем в кэш
      super.update(index, toRadians(offset * Ball.divider));
      Ball.bufferCtx.drawImage(
        this.canvas,
        0, 0,
        this.width,
        this.height,
        x, y,
        this.width,
        this.height
      );
      Ball.writes += 1;
    }
    // увеличиваем ячейку индексатора
    Ball.index[statIndexX][statIndexY] += 1;
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
}
