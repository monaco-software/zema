import '../assets/styles/Layer.css';

import React, { FC, useEffect } from 'react';
import { frame } from '../constants';

export const BackLayer: FC = () => {
  const level = 0; // TODO: get level from state

  const canvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let image = new Image();

  useEffect(() => {
    canvas = canvasRef.current as HTMLCanvasElement;
    canvas.width = frame.width;
    canvas.height = frame.height;
    canvas.style.border = '1px solid';
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const backImage = require(`../assets/images/level_${level + 1}_back.png`);
    image.src = backImage.default;
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
  }, []);

  return (
    <canvas className="Layer" ref={canvasRef} />
  );
};
