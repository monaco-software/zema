import Sprite from './sprite';
import boomSprite from '../assets/images/boom.webp';
import { BALL_DIAMETER } from '../constants';

export default class Explosion extends Sprite {
  image: HTMLImageElement;
  x = 0;
  y = 0;
  phase = 0;
  static image: HTMLImageElement;

  constructor(x = 0, y = 0) {
    super({
      yOffset: 0,
      numberOfFrames: 6,
      width: BALL_DIAMETER,
      height: BALL_DIAMETER,
    });
    if (!Explosion.image) {
      Explosion.image = new Image();
      Explosion.image.src = boomSprite;
    }
    this.x = x;
    this.y = y;
    this.image = Explosion.image;
  }
}
