import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import levels from '../levels';
import Ball from '../lib/ball';
import { ballRadius, ballStartPosition, bulletStates, frame, frogRadius } from '../constants';
import frogImage from '../assets/images/frog.png';
import '../assets/styles/Layer.css';
import { bulletActions } from '../reducer';
import { random } from '../lib/utils';
import { store } from '../../../store/store';

export const FrogLayer: FC = () => {
  const level = 0; // TODO: get level from state
  const dispatch = useDispatch();
  const frogCanvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  const levelData = levels[level];
  let ball = new Ball(random(levelData.ballsTypes));
  let frogPosition = levelData.frogPosition;
  let ballPosition = -20;
  const frog = new Image();
  let angle = 0;
  let burpBallInterval: number;
  let state = bulletStates.IDLE;

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
    ctx.translate(-frogRadius, -frogRadius);

    ctx.drawImage(frog, 0, 0, frogRadius * 2, frogRadius * 2);
    if (state === bulletStates.ARMING || state === bulletStates.ARMED ) {
      ball.update(ballPosition + 20 + ball.positionOffset, Math.PI * 1.5);
      coverWithLip(ball.ctx, ballRadius, ballPosition - ballRadius, 40);
      ctx.drawImage(ball.canvas, 35, -ballPosition + 5);
    }
  };

  // Интервал хендлер. Выкатывает шарик из брюха, устанавливает состояние "ЗАРЯЖЕНО"
  const burpBall = () => {
    if (ballPosition < 0 && state === bulletStates.ARMING) {
      ballPosition += 1;
    } else {
      dispatch(bulletActions.setState({ state: bulletStates.ARMED, color: ball.color, angle: 0 }));
      clearInterval(burpBallInterval);
    }
    drawFrog();
  };

  // листнер для реакции на изменение стостояния bullet
  const makeBullet = () => {
    const newValue = store.getState().bullet;
    if (newValue.state === state) { return; }
    state = newValue.state;
    if (state === bulletStates.ARMING) {
      const remainingColors = store.getState().remainingColors.colors;
      console.log(remainingColors);
      const randomColorIndex = random(remainingColors.length);
      ball.setColor(remainingColors[randomColorIndex]);
      ball.positionOffset = random(60);
      ballPosition = ballStartPosition;
      burpBallInterval = window.setInterval(() => burpBall(), 20);
    }
    if (state === bulletStates.IDLE) {
      ballPosition = ballStartPosition;
      drawFrog();
    }
  };
  const unsubscribe = store.subscribe(makeBullet);

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    angle = Math.atan2(e.pageX - frogPosition.x, -(e.pageY - frogPosition.y));
    drawFrog();
  };

  const mouseClick = () => {
    if (state !== bulletStates.ARMED) { return; }
    ballPosition = ballStartPosition;
    dispatch(bulletActions.setState({ state: bulletStates.SHOT, color: ball.color, angle: angle - Math.PI / 2 }));
    drawFrog();
  };

  useEffect(() => {
    canvas = frogCanvasRef.current as HTMLCanvasElement;
    canvas.width = frame.width;
    canvas.height = frame.height;
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
