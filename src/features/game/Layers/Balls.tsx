import React, { FC, useEffect } from 'react';
import levels from '../levels';
import { ballColors, ballDiameter, ballRadius, frame } from '../constants';
import { getPath } from '../lib/geometry';
import Ball from '../lib/ball';
import { useHistory } from 'react-router-dom';
import { routes } from '../../../constants';
import '../assets/styles/Layer.css';

export const BallsLayer: FC = () => {
  const level = 0; // TODO: get level from state
  const history = useHistory();
  const canvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  const levelData = levels[level];
  let path: number[][];
  let balls: Ball[] = [];
  let position = -levelData.balls * ballDiameter;
  let loop: number;
  let speed = levelData.speed * 30;

  const initBalls = () => {
    balls = [];
    for (let i = 0; i < levelData.balls; i += 1) {
      const ball = new Ball(Math.floor(Math.random() * Object.keys(ballColors).length));
      ball.position = position + i * ballDiameter;
      balls.push(ball);
    }
  };

  const drawBalls = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball) => {
      if (ball.position < 0) {
        return;
      }
      ball.update(ball.position, path[ball.position][2]);
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 10;
      ctx.drawImage(ball.canvas, path[ball.position][0] - ballRadius, path[ball.position][1] - ballRadius, ballDiameter, ballDiameter);
    });
  };

  const pushBalls = () => {
    position += 1;
    balls.forEach((ball, index) => {
      if (index === 0) {
        ball.position = position;
      } else {
        while (ball.position < balls[index - 1].position + ballDiameter - 1) {
          ball.position += 1;
        }
      }
      if (ball.position >= path.length) {
        alert('Game over');
        window.clearInterval(loop);
        initBalls();
        history.push(routes.GAME_OVER);
        return;
      }
    });
    requestAnimationFrame(() => drawBalls());
  };

  const fastForward = () => {
    if (speed <= levelData.speed) {
      loop = window.setInterval(pushBalls, 1000 * (1 / levelData.speed));
    } else {
      speed -= 1;
      pushBalls();
      setTimeout(() => fastForward(), 1000 * (1 / speed) );
    }
  };

  useEffect(() => {
    canvas = canvasRef.current as HTMLCanvasElement;
    canvas.width = frame.width;
    canvas.height = frame.height;
    canvas.style.border = '1px solid';
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    path = getPath(levelData.start, levelData.curve);
    initBalls();
    drawBalls();
    fastForward();
  }, []);

  return (
    <canvas className="Layer" ref={canvasRef} />
  );
};
