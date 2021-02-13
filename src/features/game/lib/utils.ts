
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
