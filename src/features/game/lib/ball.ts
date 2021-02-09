import Sprite from './sprite';
import { BALL_DIAMETER } from '../constants';
import ballSprite from '../assets/images/balls.png';

export default class Ball extends Sprite {
  image: HTMLImageElement;
  color = 0;
  position = 0;
  positionOffset = 0;
  acceleration = 0;

  constructor(
    color = Math.floor(Math.random() * 6),
    positionOffset = Math.floor(Math.random() * 60)
  ) {
    super({ yOffset: color * 180, numberOfFrames: 60, width: BALL_DIAMETER, height: BALL_DIAMETER });
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
