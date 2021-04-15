// Модуль отображает летящую пулю

import Ball from '../lib/ball';
import React, { FC, useEffect, useRef } from 'react';
import { fps } from '../lib/utils';
import { BULLET_SPEED } from '../setup';
import { gameActions } from '../reducer';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { getBallsRemainColors } from './utils/balls';
import { playSound, SOUNDS } from '@pages/game/lib/sound';
import { BALL_RADIUS, BULLET_STATE, FRAME, GAME_PHASE } from '../constants';
import {
  getBulletColor,
  getGamePhase,
  getShotPath,
  getShotPosition,
} from '../selectors';

export const BulletLayer: FC = () => {
  const setShotPosition = useAction(gameActions.setShotPosition);
  const setShotPath = useAction(gameActions.setShotPath);
  const setRemainColors = useAction(gameActions.setRemainColors);
  const setBulletState = useAction(gameActions.setBulletState);

  const gamePhase = useSelector(getGamePhase);

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
    const skip =
      !shotPath.length || shotPosition >= shotPath.length || shotPosition <= 0;
    if (skip) {
      return;
    }

    const x = shotPath[shotPosition][0];
    const y = shotPath[shotPosition][1];
    bullet.current.update(
      shotPosition * 3 + bullet.current.rotationOffset,
      shotPath[shotPosition][2]
    );
    ctx.drawImage(bullet.current.canvas, x - BALL_RADIUS, y - BALL_RADIUS);
  };

  useEffect(() => {
    if (gamePhase === GAME_PHASE.STARTED && shotPath.length) {
      bullet.current.color = bulletColor;
      mishit.current = false;
      setShotPosition(1);
      playSound(SOUNDS.SHOT);
    } else {
      setShotPosition(0);
    }
  }, [shotPath]);

  useEffect(() => {
    if (gamePhase !== GAME_PHASE.STARTED || !shotPath.length || !shotPosition) {
      requestRef.current = requestAnimationFrame(draw);
      return;
    }
    if (shotPosition >= shotPath.length) {
      // промахнулись
      if (!mishit.current) {
        // ставим флаг от следующей итерации
        mishit.current = true;
        setShotPath([]);
        setRemainColors(getBallsRemainColors());
        setBulletState(BULLET_STATE.ARMING);
        requestRef.current = requestAnimationFrame(draw);
        playSound(SOUNDS.MISS);
      }
      return;
    }
    requestRef.current = requestAnimationFrame(draw);
    timeoutRef.current = window.setTimeout(() => {
      setShotPosition(shotPosition + 1);
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
      style={{ position: 'absolute', height: '100%', width: '100%' }}
      ref={canvasRef}
    />
  );
};
