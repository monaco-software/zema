import { spriteOptions } from '../types';

export default class Sprite {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement = new Image();
  frameIndex = 0;
  numberOfFrames = 1;
  yOffset = 0;
  width = 0;
  height = 0;
  tick = 1;

  constructor(options?: Partial<spriteOptions>) {
    Object.assign(this, options);
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  update(index = 0, angle = 0): void {
    if (index < 0) {
      console.warn('Index of frame must be >= 0');
      index = 0;
    }
    const rotateAngle = angle - Math.PI / 2;
    this.frameIndex = Math.floor(index / this.tick) % this.numberOfFrames;
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.save();
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.rotate(rotateAngle);
    this.ctx.translate(-this.width / 2, -this.height / 2);
    this.ctx.drawImage(
      this.image,
      this.xPosition(this.frameIndex),
      this.yPosition(this.frameIndex),
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    );
    this.ctx.restore();
  }

  xPosition(index: number) {
    const cols = this.image.width / this.width;
    return (index % cols) * this.width;
  }

  yPosition(index: number) {
    const cols = this.image.width / this.width;
    return this.yOffset + Math.floor(index / cols) * this.height;
  }
}
