/** eslint prefer-const: "error" */
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import levels from '../levels';
import {
  BALL_RADIUS,
  BULLET_ARMED_POSITION,
  BULLET_START_POSITION,
  BULLET_STATE,
  FRAME,
  FROG_RADIUS,
} from '../constants';
import { gameActions } from '../reducer';
import { getBulletPosition, getBulletState, getCurrentLevel } from '../selectors';

import Frog from '../lib/frog';
import bullet from '../lib/bullet';

import '../assets/styles/Layer.css';

export const FrogLayer: FC = () => {
  const level = useSelector(getCurrentLevel);
  const dispatch = useDispatch();

  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const frogCanvasRef = React.createRef<HTMLCanvasElement>();
  const [angle, setAngle] = React.useState(0);
  const bulletState = useSelector(getBulletState);

  const frog = new Frog();
  const bulletPosition = useSelector(getBulletPosition);

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
    if (!ctx) {
      throw new Error('Context not found');
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(levels[level].frogPosition.x, levels[level].frogPosition.y);
    ctx.rotate(angle);
    ctx.translate(-FROG_RADIUS, -FROG_RADIUS);

    ctx.drawImage(frog.image, 0, 0, FROG_RADIUS * 2, FROG_RADIUS * 2);
    if (bulletState === BULLET_STATE.ARMING || bulletState === BULLET_STATE.ARMED) {
      bullet.update(bulletPosition + bullet.positionOffset, Math.PI * 1.5);
      coverWithLip(bullet.ctx, BALL_RADIUS, bulletPosition - 35, 40);
      ctx.drawImage(bullet.canvas, 35, -bulletPosition + 25);
    }
  };

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setAngle(
      Math.atan2(
        levels[level].frogPosition.x - e.pageX,
        e.pageY - levels[level].frogPosition.y) + Math.PI);
    drawFrog();
  };

  const mouseClick = () => {
    if (bulletState !== BULLET_STATE.ARMED) {
      return;
    }
    dispatch(gameActions.setBullet({
      state: BULLET_STATE.SHOT,
      color: bullet.color,
      angle: angle - Math.PI / 2,
      position: bullet.position,
    }));
    drawFrog();
  };

  useEffect(() => {
    if (!ctx) {
      return;
    }
    if (bulletState === BULLET_STATE.ARMING) {
      // выкатываем шар из брюха
      if (bulletPosition < BULLET_ARMED_POSITION) {
        setTimeout(() => {
          dispatch(gameActions.setBulletPosition(bulletPosition + 1));
        }, 15);
      } else {
        dispatch(gameActions.setBulletState(BULLET_STATE.ARMED));
      }
    }
    if (bulletState === BULLET_STATE.IDLE) {
      bullet.position = BULLET_START_POSITION;
    }
    drawFrog();
  }, [bulletState, bulletPosition]);

  // init
  useEffect(() => {
    if (!frogCanvasRef.current) {
      throw new Error('Frog canvas not found');
    }
    const canvas = frogCanvasRef.current;
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Cant create frog context');
    }
    setCtx(context);
    frog.image.onload = () => {
      dispatch(gameActions.setBulletState(BULLET_STATE.IDLE));
    };
  }, []);

  return (
    <canvas className="Layer"
      ref={frogCanvasRef}
      onMouseMove={mouseMove}
      onClick={mouseClick} />
  );
};
