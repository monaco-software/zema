/** eslint prefer-const: "error" */
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import levels from '../levels';
import Ball from '../lib/ball';
import { BALL_RADIUS, BALL_START_POSITION, BULLET_STATE, FRAME, FROG_RADIUS } from '../constants';
import frogImage from '../assets/images/frog.png';
import '../assets/styles/Layer.css';
import { gameActions } from '../reducer';
import { random } from '../lib/utils';
import { store } from '../../../store/store';

export const FrogLayer: FC = () => {
  const level = store.getState().game.currentLevel;
  const dispatch = useDispatch();
  const frogCanvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  const levelData = levels[level];
  const ball = new Ball(random(levelData.ballsTypes));
  const frogPosition = levelData.frogPosition;
  let ballPosition = BALL_START_POSITION;
  const frog = new Image();
  let angle = 0;
  let burpBallInterval: number;
  let state = BULLET_STATE.IDLE;

  // отрезает часть шарика, "накрытого" губой лягушки
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
    ctx.translate(-FROG_RADIUS, -FROG_RADIUS);

    ctx.drawImage(frog, 0, 0, FROG_RADIUS * 2, FROG_RADIUS * 2);
    if (state === BULLET_STATE.ARMING || state === BULLET_STATE.ARMED ) {
      ball.update(ballPosition + 20 + ball.positionOffset, Math.PI * 1.5);
      coverWithLip(ball.ctx, BALL_RADIUS, ballPosition - BALL_RADIUS, 40);
      ctx.drawImage(ball.canvas, 35, -ballPosition + 5);
    }
  };

  // Интервал хендлер. Выкатывает шарик из брюха, устанавливает состояние "ЗАРЯЖЕНО"
  const burpBall = () => {
    if (ballPosition < 0 && state === BULLET_STATE.ARMING) {
      ballPosition += 1;
    } else {
      dispatch(gameActions.setBullet({ state: BULLET_STATE.ARMED, color: ball.color, angle: 0 }));
      clearInterval(burpBallInterval);
    }
    drawFrog();
  };

  // листнер для реакции на изменение стостояния bullet
  const makeBullet = () => {
    const newValue = store.getState().game.bullet;
    if (newValue.state === state) { return; }
    state = newValue.state;
    if (state === BULLET_STATE.ARMING) {
      const remainingColors = store.getState().game.colors;
      const randomColorIndex = random(remainingColors.length);
      ball.setColor(remainingColors[randomColorIndex]);
      ball.positionOffset = random(60);
      ballPosition = BALL_START_POSITION;
      burpBallInterval = window.setInterval(() => burpBall(), 20);
    }
    if (state === BULLET_STATE.IDLE) {
      ballPosition = BALL_START_POSITION;
      drawFrog();
    }
  };
  const unsubscribe = store.subscribe(makeBullet);

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    angle = Math.atan2(frogPosition.x - e.pageX, e.pageY - frogPosition.y) + Math.PI;
    drawFrog();
  };

  const mouseClick = () => {
    if (state !== BULLET_STATE.ARMED) { return; }
    ballPosition = BALL_START_POSITION;
    dispatch(gameActions.setBullet({ state: BULLET_STATE.SHOT, color: ball.color, angle: angle - Math.PI / 2 }));
    drawFrog();
  };

  useEffect(() => {
    canvas = frogCanvasRef.current as HTMLCanvasElement;
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    canvas.style.border = '1px solid';
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    frog.onload = () => {
      drawFrog();
    };
    frog.src = frogImage;

    return () => {
      clearInterval(burpBallInterval);
      unsubscribe();
    };
  }, []);

  return (
    <canvas className="Layer" ref={frogCanvasRef}
      onMouseMove={mouseMove}
      onClick={mouseClick}
    />
  );
};
