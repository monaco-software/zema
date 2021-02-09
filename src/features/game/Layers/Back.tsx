/** eslint prefer-const: "error" */
import '../assets/styles/Layer.css';
import React, { FC, useEffect } from 'react';
import { FRAME } from '../constants';
import { store } from '../../../store/store';

export const BackLayer: FC = () => {
  const level = store.getState().game.currentLevel;

  const backCanvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  const image = new Image();

  useEffect(() => {
    canvas = backCanvasRef.current as HTMLCanvasElement;
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    canvas.style.border = '1px solid';
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const backImage = require(`../assets/images/level_${level + 1}_back.png`);
    image.src = backImage.default;
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
  }, []);

  return (
    <canvas className="Layer" ref={backCanvasRef} />
  );
};
