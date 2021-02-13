import Sprite from './sprite';
import { random } from './utils';

import ballSprite from '../assets/images/balls.png';
import { BALL_RADIUS } from '../constants';

export default class Ball extends Sprite {
  protected _color = 0;
  protected _positionOffset = 0;

  position = 0;
  acceleration = 0;

  constructor(
    color = random(6),
    positionOffset = random(60)
  ) {
    super({ yOffset: color * 180, numberOfFrames: 60, width: BALL_RADIUS * 2, height: BALL_RADIUS * 2 });
    this._color = color;
    this.positionOffset = positionOffset;
    this.image = new Image();
    this.image.src = ballSprite;
  }

  get color() {
    return this._color;
  }

  set color(newColor) {
    this._color = newColor;
    this.yOffset = this._color * 180;
  }

  get positionOffset() {
    return this._positionOffset;
  }

  set positionOffset(offset: number) {
    let naturalOffset = offset;
    while (naturalOffset < 0) {
      naturalOffset += this.numberOfFrames;
    }
    this._positionOffset = naturalOffset;
  }
}
