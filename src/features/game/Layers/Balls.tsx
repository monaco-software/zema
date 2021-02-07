import React, { FC, useEffect } from 'react';
import levels from '../levels';
import { ballColors, ballDiameter, ballRadius, bulletSpeed, frame, frogRadius } from '../constants';
import { getPath } from '../lib/geometry';
import Ball from '../lib/ball';
import { useHistory } from 'react-router-dom';
import { routes } from '../../../constants';
import '../assets/styles/Layer.css';
import eventBus from '../lib/event-bus';

export const BallsLayer: FC = () => {
  let bulletBall: Ball;
  let bulletPath: number[][] = [];
  let bulletPosition = 0;
  let bulletPresent = false;

  const level = 0; // TODO: get level from state
  const history = useHistory();
  const ballCanvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  const levelData = levels[level];
  let path: number[][];
  let balls: Ball[] = [];
  let position = -levelData.balls * ballDiameter;

  let speed = 500;

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
    if (bulletPresent) {
      bulletBall.update(bulletPosition, bulletPath[bulletPosition][2]);
      ctx.drawImage(
        bulletBall.canvas,
        bulletPath[bulletPosition][0] - ballRadius,
        bulletPath[bulletPosition][1] - ballRadius,
        ballDiameter, ballDiameter);
    }
    if (bulletPresent && bulletPath) {
      bulletPath.forEach((c) => {
        ctx.fillStyle = '#000';
        // ctx.strokeStyle = '#000';
        ctx.fillRect(c[0], c[1], 1, 1); // fill in the pixel at (10,10)
      });
    }
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
        balls.length = 0;
        history.push(routes.GAME_OVER);
        return;
      }
    });
    requestAnimationFrame(() => drawBalls());
  };

  const pushBullet = () => {
    if (bulletPresent) {
      if (bulletPosition >= bulletPath.length - 1) {
        bulletPresent = false;
      } else {
        bulletPosition += 1;
      }
    }
    requestAnimationFrame(() => drawBalls());
  };

  const fastForward = () => {
    if (speed >= levelData.speed) {
      speed -= 1;
      pushBalls();
      setTimeout(() => fastForward(), 1000 * (1 / speed));
    }
  };

  useEffect(() => {
    canvas = ballCanvasRef.current as HTMLCanvasElement;
    canvas.width = frame.width;
    canvas.height = frame.height;
    canvas.style.border = '1px solid';
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    path = getPath(levelData.start, levelData.curve);
    initBalls();
    drawBalls();
    if (process.env.NODE_ENV === 'development') {
      balls[balls.length - 1].position = 700;
    }
    const ballsPushLoop = window.setInterval(pushBalls, 1000 * (1 / levelData.speed));
    const shotLoop = window.setInterval(pushBullet, 20);
    fastForward();
    return () => {
      clearInterval(ballsPushLoop);
      clearInterval(shotLoop);
    };
  }, []);

  eventBus.on('shot', (angle, color) => {
    bulletBall = new Ball(color);
    bulletPath = [];
    bulletPosition = 0;
    bulletPresent = true;

    for (let i = frogRadius; i < frame.width; i += bulletSpeed) {
      const x = Math.round(levelData.frogPosition.x + i * Math.cos(angle));
      const y = Math.round(levelData.frogPosition.y + i * Math.sin(angle));
      if (x >= 0 && x <= frame.width && y >= 0 && y <= frame.height) {
        bulletPath.push([x, y, angle]);
      }
    }
    console.dir(bulletPath);
  });

  return (
    <canvas className="Layer"
      ref={ballCanvasRef} />
  );
};
