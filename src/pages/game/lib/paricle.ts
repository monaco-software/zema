import Sprite from './sprite';
import particleSprite from '../assets/images/particle.webp';
import { BALL_DIAMETER } from '../constants';

export default class Particle extends Sprite {
  image: HTMLImageElement;
  x = 0;
  y = 0;
  phase = 0;
  static image: HTMLImageElement;

  constructor(x = 0, y = 0) {
    super({
      yOffset: 0,
      numberOfFrames: 16,
      width: BALL_DIAMETER,
      height: BALL_DIAMETER,
    });
    if (!Particle.image) {
      Particle.image = new Image();
      Particle.image.src = particleSprite;
    }
    this.x = x;
    this.y = y;
    this.image = Particle.image;
  }
}
