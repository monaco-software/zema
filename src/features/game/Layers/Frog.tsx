/** eslint prefer-const: "error" */
import React, { FC, useEffect, useRef } from 'react';
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
  const dispatch = useDispatch();

  const bulletState = useSelector(getBulletState);
  const bulletPosition = useSelector(getBulletPosition);
  const level = useSelector(getCurrentLevel);

  const frogCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const angle = useRef(0);
  const frog = useRef(new Frog());

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
    const ctx = frogCanvasRef.current?.getContext('2d');

    if (!ctx) {
      throw new Error('Context not found');
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(levels[level].frogPosition.x, levels[level].frogPosition.y);
    ctx.rotate(angle.current);
    ctx.translate(-FROG_RADIUS, -FROG_RADIUS);

    ctx.drawImage(frog.current.image, 0, 0, FROG_RADIUS * 2, FROG_RADIUS * 2);
    if (bulletState === BULLET_STATE.ARMING || bulletState === BULLET_STATE.ARMED) {
      bullet.update(bulletPosition + bullet.positionOffset, Math.PI * 1.5);
      coverWithLip(bullet.ctx, BALL_RADIUS, bulletPosition - 35, 40);
      ctx.drawImage(bullet.canvas, 35, -bulletPosition + 25);
    }
  };

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const y = levels[level].frogPosition.x - e.pageX;
    const x = e.pageY - levels[level].frogPosition.y;
    angle.current = Math.atan2(y, x) + Math.PI;

    drawFrog();
  };

  const mouseClick = () => {
    if (bulletState !== BULLET_STATE.ARMED) {
      return;
    }
    dispatch(gameActions.setBullet({
      state: BULLET_STATE.SHOT,
      color: bullet.color,
      angle: angle.current - Math.PI / 2,
      position: bullet.position,
    }));
    drawFrog();
  };

  useEffect(() => {
    const ctx = frogCanvasRef.current?.getContext('2d');

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
    const canvas = frogCanvasRef.current;
    if (!canvas) {
      throw new Error('Frog canvas not found');
    }

    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Cant create frog context');
    }

    frog.current.image.onload = () => {
      dispatch(gameActions.setBulletState(BULLET_STATE.IDLE));
    };
  }, []);

  return (
    <canvas
      className="Layer"
      ref={frogCanvasRef}
      onMouseMove={mouseMove}
      onClick={mouseClick}
    />
  );
};
