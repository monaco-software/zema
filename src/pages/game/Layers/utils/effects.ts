export const traceShotPath = (ctx: CanvasRenderingContext2D, shotPath: number[][]) => {
  shotPath.forEach((p: number[]) => {
    ctx.fillStyle = '#f0f';
    ctx.fillRect(p[0], p[1], 1, 1);
  });
};
