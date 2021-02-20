/** eslint prefer-const: "error" */
// Модуль отображает взрывы, частицы и летящую пулю

import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BALL_RADIUS, BULLET_STATE, FRAME } from '../constants';
import { getShotPath, getShotPosition } from '../selectors';
import bulletObject from '../lib/bullet';
import { gameActions } from '../reducer';

import { traceShotPath } from './utils/effects';
import { fps } from '../lib/utils';
import { BULLET_SPEED } from '../setup';

export const BulletLayer: FC = () => {
  const dispatch = useDispatch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shotPath = useSelector(getShotPath);
  const shotPosition = useSelector(getShotPosition);

  const bullet = useRef(bulletObject);
  const timeoutRef = React.useRef<number>();
  const requestRef = React.useRef<number>();

  const drawEffects = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    // рисуем пулю
    if (shotPath.length) {
      traceShotPath(ctx, shotPath);

      if (bullet.current.position >= shotPath.length) { // промахнулись
        dispatch(gameActions.setShotPath([]));
        dispatch(gameActions.setBulletState(BULLET_STATE.ARMING));
      } else {
        const x = shotPath[bullet.current.position][0];
        const y = shotPath[bullet.current.position][1];
        bullet.current.update(
          bullet.current.position * 3 + bullet.current.positionOffset,
          shotPath[bullet.current.position][2]);
        ctx.drawImage(bullet.current.canvas, x - BALL_RADIUS, y - BALL_RADIUS,
        );
        bullet.current.position += 1;
        dispatch(gameActions.setShotPosition([x, y]));
      }
    }
  };

  useEffect(() => {
    if (shotPath.length) {
      bullet.current.position = 0;
    }
    requestRef.current = requestAnimationFrame(drawEffects);
  }, [shotPath]);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => drawEffects(), fps(BULLET_SPEED));
  }, [shotPosition]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Bullet canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    return () => {
      clearTimeout(timeoutRef.current);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      style={{ position: 'absolute' }}
      ref={canvasRef}
    />
  );
};
