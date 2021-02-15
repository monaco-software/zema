/** eslint prefer-const: "error" */
// Бэкграунд
import { useSelector } from 'react-redux';
import { getCurrentLevel } from '../selectors';
import React, { FC, useEffect } from 'react';

import { FRAME } from '../constants';

import '../assets/styles/Layer.css';

export const BackLayer: FC = () => {
  const level: number = useSelector(getCurrentLevel);

  const canvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  const image = new Image();

  useEffect(() => {
    canvas = canvasRef.current as HTMLCanvasElement;
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
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
