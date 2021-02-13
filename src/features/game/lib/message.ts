import { spriteOptions } from '../types';
import { decimalToHex } from './utils';

export default class Sprite {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement = new Image();
  numberOfFrames = 16;
  currentFrame = 16;
  width = 800;
  height = 600;

  constructor(options?: Partial<spriteOptions>) {
    Object.assign(this, options);
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  update(): number {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#FFFFFF' + decimalToHex(this.currentFrame * 16);
    this.ctx.font = '20px san-serif';

    let textString = 'Hello look at me!!!';
    let textWidth = this.ctx.measureText(textString ).width;

    this.ctx.fillText(textString, this.canvas.width / 2 - textWidth / 2, 100);

    this.ctx.save();
    this.ctx.restore();
    return this.currentFrame;
  }
}
