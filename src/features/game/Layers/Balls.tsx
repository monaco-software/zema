import React, { FC, useEffect } from 'react';
import levels from '../levels';
import { ballColors, ballDiameter, ballRadius, bulletSpeed, bulletStates, frame, frogRadius } from '../constants';
import { getPath } from '../lib/geometry';
import Ball from '../lib/ball';
import { useHistory } from 'react-router-dom';
import { routes } from '../../../constants';
import '../assets/styles/Layer.css';
// import { useSelector } from 'react-redux';
import { store } from '../../../store';
import { bulletActions } from '../reducer';
import { useDispatch } from 'react-redux';

export const BallsLayer: FC = () => {
  const dispatch = useDispatch();

  let bullet = { ...store.getState().bullet };

  const bulletPath: number[][] = [];
  let bulletBall: Ball;
  let bulletPosition = 0;
  let shotLoop = 0;

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
    if (bulletPath.length) {
      bulletBall.update(bulletPosition, bulletPath[bulletPosition][2]);
      ctx.drawImage(
        bulletBall.canvas,
        bulletPath[bulletPosition][0] - ballRadius,
        bulletPath[bulletPosition][1] - ballRadius,
        ballDiameter, ballDiameter);
    }
    if (bulletPath.length) {
      bulletPath.forEach((c) => {
        ctx.fillStyle = '#000';
        ctx.fillRect(c[0], c[1], 1, 1);
      });
    }
  };

  const pushBullet = () => {
    if (bulletPath.length) {
      if (bulletPosition >= bulletPath.length - 1) { // промахнулись
        bulletPath.length = 0;
        dispatch(bulletActions.setState({ state: bulletStates.ARMING, color: 0, angle: 0 }));
        clearInterval(shotLoop);
      } else {
        bulletPosition += 1;
      }
    }
    requestAnimationFrame(() => drawBalls());
  };

  const makeShot = () => {
    const newValue = store.getState().bullet;
    console.log(newValue);
    if (newValue.state !== bullet.state && newValue.state !== bulletStates.SHOT) {
      return;
    }
    bullet = Object.assign(bullet, newValue);
    bulletBall = new Ball(newValue.color);
    bulletPosition = 0;
    for (let i = frogRadius; i < frame.width; i += bulletSpeed) {
      const x = Math.round(levelData.frogPosition.x + i * Math.cos(bullet.angle));
      const y = Math.round(levelData.frogPosition.y + i * Math.sin(bullet.angle));
      if (x >= 0 && x <= frame.width && y >= 0 && y <= frame.height) {
        bulletPath.push([x, y, bullet.angle]);
      }
    }
    shotLoop = window.setInterval(pushBullet, 20);
  };
  const unsubscribe = store.subscribe(makeShot);

  const initBalls = () => {
    balls = [];
    for (let i = 0; i < levelData.balls; i += 1) {
      const ball = new Ball(Math.floor(Math.random() * Object.keys(ballColors).length));
      ball.position = position + i * ballDiameter;
      balls.push(ball);
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

  const fastForward = () => {
    if (speed >= levelData.speed) {
      speed -= 1;
      pushBalls();
      setTimeout(() => fastForward(), 1000 * (1 / speed));
    } else {
      dispatch(bulletActions.setState({ state: bulletStates.ARMING, color: 0, angle: 0 }));
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
    fastForward();
    return () => {
      clearInterval(ballsPushLoop);
      clearInterval(shotLoop);
      unsubscribe();
    };
  }, []);

  return (
    <canvas className="Layer"
      ref={ballCanvasRef} />
  );
};
