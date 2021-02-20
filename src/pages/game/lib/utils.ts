import Ball from './ball';

export function padWithSpaces(text: string, size: number): string {
  if (text.length >= size) { return text; }
  const diff = size - text.length;
  return text + ' '.repeat(diff);
}

export function random(number: number): number {
  return Math.floor(Math.random() * number);
}

export function createFilledConsistentlyArray(size: number): number[] {
  return [...Array(size).keys()];
}

export function decimalToHex(d: number, padding = 2) {
  let hex = Number(d).toString(16);
  while (hex.length < padding) {
    hex = '0' + hex;
  }
  return hex;
}

export function distort(max: number, phases: number, phase: number, gain = 0.5) {
  const value = max * gain + max * phase / phases;
  return value > max ? max : Math.floor(value);
}

export function fps(frames: number): number {
  return 1000 * (1 / frames);
}

export function bufferDownloader() {
  const link = document.createElement('a');
  if (!link) { return; }
  link.setAttribute('download', 'HugePaper.png');
  link.setAttribute('href', Ball.bufferCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
  link.click();
}

