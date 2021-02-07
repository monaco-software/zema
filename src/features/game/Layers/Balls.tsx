import React, { FC, useEffect } from 'react';
import levels from '../levels';
import { ballDiameter, ballRadius, bulletSpeed, bulletStates, frame, frogRadius, skullRadius } from '../constants';
import { getPath } from '../lib/geometry';
import Ball from '../lib/ball';
import { useHistory } from 'react-router-dom';
import { routes } from '../../../constants';
import '../assets/styles/Layer.css';
import skullImage from '../assets/images/skull.png';
import { store } from '../../../store';
import { bulletActions } from '../reducer';
import { useDispatch } from 'react-redux';

export const BallsLayer: FC = () => {
  const dispatch = useDispatch();

  let bullet = { ...store.getState().bullet };

  const level = 0; // TODO: get level from state
  const levelData = levels[level];

  const bulletPath: number[][] = [];
  let bulletBall = new Ball(Math.floor(Math.random() * levelData.ballsTypes));
  let bulletPosition = 0;
  let shotLoop = 0;
  let ballsPushLoop = 0;

  let skull = new Image();

  const history = useHistory();
  const ballCanvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let path: number[][];
  let balls: Ball[] = [];
  let position = levelData.balls * ballDiameter;
  position = 0;

  let speed = 1500;
  let win = true;
  let ended = false;
  let skullAngle = 0;

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
    if (skullAngle !== 0) {
      ctx.translate(levelData.skullPosition.x + skullRadius, levelData.skullPosition.y + skullRadius);
      ctx.rotate(skullAngle);
      ctx.translate(-skullRadius, -skullRadius);
      ctx.drawImage(skull, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.drawImage(skull, levelData.skullPosition.x, levelData.skullPosition.y);
    }

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
        if (store.getState().bullet.state !== bulletStates.IDLE) { // если ира еще не окончена
          dispatch(bulletActions.setState({ state: bulletStates.ARMING, color: 0, angle: 0 }));
        }
        clearInterval(shotLoop);
      } else {
        bulletPosition += 1;
      }
    }
    requestAnimationFrame(() => drawBalls());
  };

  const makeShot = () => {
    const newValue = store.getState().bullet;
    if (newValue.state === bullet.state) { return; }
    bullet = Object.assign(bullet, newValue);
    if (newValue.state === bulletStates.SHOT) {
      bulletBall.setColor(newValue.color);
      bulletPosition = 0;
      for (let i = frogRadius; i < frame.width; i += bulletSpeed) {
        const x = Math.round(levelData.frogPosition.x + i * Math.cos(bullet.angle));
        const y = Math.round(levelData.frogPosition.y + i * Math.sin(bullet.angle));
        if (x >= 0 && x <= frame.width && y >= 0 && y <= frame.height) {
          bulletPath.push([x, y, bullet.angle]);
        }
      }
      shotLoop = window.setInterval(pushBullet, 20);
    }
  };
  const unsubscribe = store.subscribe(makeShot);

  const initBalls = () => {
    balls = [];
    for (let i = 0; i < levelData.balls; i += 1) {
      const ball = new Ball(Math.floor(Math.random() * levelData.ballsTypes));
      ball.position = position + i * ballDiameter;
      balls.push(ball);
    }
  };

  const pushBalls = () => {
    if (!balls.length && !ended) {
      ended = true;
      clearInterval(ballsPushLoop);
      if (win) {
        alert('You win!)');
        history.push(routes.GAME_LEVELS);
      } else {
        alert('You are a loser');
        history.push(routes.GAME_OVER);
      }
      return;
    }
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
        if (win) {
          win = false;
          dispatch(bulletActions.setState({ state: bulletStates.IDLE, color: 0, angle: 0 }));
        }
        balls.pop();
        position += 28;
        // делаем один оборот
        skullAngle < Math.PI * 2 ? skullAngle += Math.PI / 15 : skullAngle = Math.PI * 2;
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
    // drawBalls();
    if (process.env.NODE_ENV === 'development') {
      balls[balls.length - 1].position = 700;
    }
    ballsPushLoop = window.setInterval(pushBalls, 1000 * (1 / levelData.speed));
    skull.src = skullImage;
    skull.onload = () => {
      ctx.drawImage(skull, levelData.skullPosition.x, levelData.skullPosition.y);
      fastForward();
    };
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
