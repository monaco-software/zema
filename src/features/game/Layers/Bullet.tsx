// Модуль отображает летящую пулю

import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BALL_RADIUS, BULLET_STATE, FRAME } from '../constants';
import { getBulletColor, getShotPath, getShotPosition } from '../selectors';
import { gameActions } from '../reducer';

import { traceShotPath } from './utils/effects';
import { getBallsRemainColors } from './utils/balls';
import { fps } from '../lib/utils';
import { BULLET_SPEED } from '../setup';
import Ball from '../lib/ball';

export const BulletLayer: FC = () => {
  const dispatch = useDispatch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shotPath = useSelector(getShotPath);
  const shotPosition = useSelector(getShotPosition);
  const bulletColor = useSelector(getBulletColor);

  const bullet = useRef(new Ball());
  const timeoutRef = useRef<number>();
  const requestRef = useRef<number>();
  const mishit = useRef(false);

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    if (!shotPath.length || shotPosition >= shotPath.length) { return; }

    traceShotPath(ctx, shotPath);

    const x = shotPath[shotPosition][0];
    const y = shotPath[shotPosition][1];
    bullet.current.update(
      shotPosition * 3 + bullet.current.rotationOffset,
      shotPath[shotPosition][2]);
    ctx.drawImage(bullet.current.canvas, x - BALL_RADIUS, y - BALL_RADIUS,
    );
  };

  useEffect(() => {
    if (shotPath.length) {
      bullet.current.color = bulletColor;
      mishit.current = false;
      dispatch(gameActions.setShotPosition(1));
    }
  }, [shotPath]);

  useEffect(() => {
    if (shotPosition >= shotPath.length) { // промахнулись
      if (!mishit.current) {
        // ставим флаг от следующей итерации
        mishit.current = true;
        dispatch(gameActions.setShotPath([]));
        dispatch(gameActions.setShotPosition(0));
        dispatch(gameActions.setRemainColors(getBallsRemainColors()));
        dispatch(gameActions.setBulletState(BULLET_STATE.ARMING));
        requestRef.current = requestAnimationFrame(draw);
      }
      return;
    }
    requestRef.current = requestAnimationFrame(draw);
    timeoutRef.current = window.setTimeout(() => {
      dispatch(gameActions.setShotPosition(shotPosition + 1));
    }, fps(BULLET_SPEED));
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
