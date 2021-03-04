import Sprite from './sprite';
import boomSprite from '../assets/images/boom.png';
import { BALL_DIAMETER } from '../constants';

export default class Explosion extends Sprite {
  image: HTMLImageElement;
  x = 0;
  y = 0;
  phase = 0;

  constructor(x = 0, y = 0) {
    super({ yOffset: 0, numberOfFrames: 6, width: BALL_DIAMETER, height: BALL_DIAMETER });
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = boomSprite;
  }
}
