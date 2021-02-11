import Sprite from './sprite';
import { random } from './utils';
import { BALL_DIAMETER, BULLET_ARMED_POSITION } from '../constants';

import ballSprite from '../assets/images/balls.png';

class Bullet extends Sprite {
  image = new Image();
  _color = 0;
  position = 0;
  positionOffset = 0;

  protected static instance: Bullet;

  constructor(
    color = random(6),
    positionOffset = random(60)
  ) {
    super({ yOffset: color * 180, numberOfFrames: 60, width: BALL_DIAMETER, height: BALL_DIAMETER });
    if (Bullet.instance) {
      return Bullet.instance;
    }
    Bullet.instance = this;

    this._color = color;
    this.positionOffset = positionOffset;
    this.image.src = ballSprite;
  }

  setColor(color: number): void {
    this.color = color;
    this.yOffset = color * 180;
  }
  isArmed() {
    return this.position >= BULLET_ARMED_POSITION;
  }
  get color() {
    return this._color;
  }

  set color(newColor) {
    console.log(`setting color ${newColor}`);
    this._color = newColor;
    this.yOffset = this._color * 180;
  }
}

export default new Bullet();
