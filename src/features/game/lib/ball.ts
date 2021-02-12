import Sprite from './sprite';
import { random } from './utils';

import ballSprite from '../assets/images/balls.png';
import { BALL_RADIUS } from '../constants';

export default class Ball extends Sprite {
  image: HTMLImageElement;
  color = 0;
  position = 0;
  positionOffset = 0;
  acceleration = 0;

  constructor(
    color = random(6),
    positionOffset = random(60)
  ) {
    super({ yOffset: color * 180, numberOfFrames: 60, width: BALL_RADIUS * 2, height: BALL_RADIUS * 2 });
    this.color = color;
    this.positionOffset = positionOffset;
    this.image = new Image();
    this.image.src = ballSprite;
  }

  setColor(color: number): void {
    this.color = color;
    this.yOffset = color * 180;
  }
}
