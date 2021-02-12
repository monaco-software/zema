import Sprite from './sprite';
import { BALL_RADIUS } from '../constants';
import particleSprite from '../assets/images/particle.png';

export default class Particle extends Sprite {
  image: HTMLImageElement;
  x = 0;
  y = 0;
  phase = 0;

  constructor(x = 0, y = 0) {
    super({ yOffset: 0, numberOfFrames: 16, width: BALL_RADIUS * 2, height: BALL_RADIUS * 2 });
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = particleSprite;
  }
}
