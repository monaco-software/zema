import { font } from './font';

interface Print {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  text: string;
  color: string;
}

type FontKey = keyof typeof font;

const space = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

export function print(param: Print) {
  param.ctx.fillStyle = param.color;
  param.text.split('').forEach((char, index) => {
    const printChar = char === ' ' ? space : font[char as FontKey].pixels;
    const offset = font[char as FontKey].offset;

    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 5; x += 1) {
        if (printChar[y] && printChar[y][x]) {
          param.ctx.fillRect(param.x + x + index * 6, param.y + y + offset, 1, 1);
        }
      }
    }
  });
}
