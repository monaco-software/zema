import Sprite from './sprite';
import { BALL_RADIUS } from '../constants';
import boomSprite from '../assets/images/boom.png';

export default class Explosion extends Sprite {
  image: HTMLImageElement;
  x = 0;
  y = 0;
  phase = 0;

  constructor(x = 0, y = 0) {
    super({ yOffset: 0, numberOfFrames: 6, width: BALL_RADIUS * 2, height: BALL_RADIUS * 2 });
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = boomSprite;
  }
}