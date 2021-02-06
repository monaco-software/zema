import Sprite from './sprite';
import { ballColors } from '../constants';
import * as ballSprite from '../assets/images/ball.png';

export default class Ball extends Sprite {
  image: HTMLImageElement;

  constructor(color = ballColors.BLUE) {
    super({ yOffset: color * 180, numberOfFrames: 60, width: 30, height: 30 });
    this.image = new Image();
    this.image.src = ballSprite;
  }
}
