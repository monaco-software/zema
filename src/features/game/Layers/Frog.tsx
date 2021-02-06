import React, { FC, useEffect } from 'react';
import levels from '../levels';
import { ballColors, ballRadius, frame, frogRadius } from '../constants';
import Ball from '../lib/ball';
import frogImage from '../assets/images/frog.png';
import '../assets/styles/Layer.css';

export const FrogLayer: FC = () => {
  const level = 0; // TODO: get level from state
  const frogCanvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  const levelData = levels[level];
  let ball = new Ball(Math.floor(Math.random() * Object.keys(ballColors).length));
  let frogPosition = levelData.frogPosition;
  let ballPosition = -20;
  const frog = new Image();
  frog.src = frogImage;
  let angle = 0;

  const coverWithLip = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawFrog = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(frogPosition.x, frogPosition.y);
    ctx.rotate(angle);
    ctx.translate(-frogRadius, -frogRadius);
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 1;

    ctx.drawImage(frog, 0, 0, frogRadius * 2, frogRadius * 2);
    ball.update(ballPosition + 20, Math.PI * 1.5);
    coverWithLip(ball.ctx, ballRadius, ballPosition - ballRadius, 40);
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.drawImage(ball.canvas, 35, -ballPosition + 5);
  };

  const burpBall = () => {
    if (ballPosition < 0) {
      ballPosition += 1;
      drawFrog();
    }
  };

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    angle = Math.atan2(e.pageX - frogPosition.x, -(e.pageY - frogPosition.y));
    drawFrog();
  };

  const mouseClick = () => {
    if (ballPosition < 0) { return; }
    ball = new Ball(Math.floor(Math.random() * Object.keys(ballColors).length));
    ballPosition = -20;
  };

  useEffect(() => {
    canvas = frogCanvasRef.current as HTMLCanvasElement;
    canvas.width = frame.width;
    canvas.height = frame.height;
    canvas.style.border = '1px solid';
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    setInterval(() => burpBall(), 20);
  }, []);

  return (
    <canvas className="Layer" ref={frogCanvasRef}
      onMouseMove={mouseMove}
      onClick={mouseClick}
    />
  );
};
