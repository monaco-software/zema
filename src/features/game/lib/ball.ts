import Sprite from './sprite';
import { ballDiameter } from '../constants';
import ballSprite from '../assets/images/balls.png';

export default class Ball extends Sprite {
  image: HTMLImageElement;
  color = 0;
  position = 0;

  constructor(color = Math.floor(Math.random() * 6)) {
    super({ yOffset: color * 180, numberOfFrames: 60, width: ballDiameter, height: ballDiameter });
    this.color = color;
    this.image = new Image();
    this.image.src = ballSprite;
  }

  setColor(color: number): void {
    this.color = color;
    this.yOffset = color * 180;
  }
}
