// Модуль отображает лягушку

import React, { FC, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import {
  BALL_RADIUS,
  BULLET_ARMED_POSITION,
  BULLET_START_POSITION,
  BULLET_STATE,
  FRAME,
  FROG_RADIUS,
  GAME_PHASE,
} from '../constants';
import {
  getAngle,
  getBulletPosition,
  getBulletState,
  getCurrentLevel,
  getGamePhase,
  getRemainColors,
} from '../selectors';
import { gameActions } from '../reducer';
import levels from '../levels';
import Frog from '../lib/frog';
import { fps, random } from '../lib/utils';
import { coverWithLip } from './utils/frog';
import Ball from '../lib/ball';
import { BULLET_ARMING_SPEED } from '../setup';
import { useAction } from '../../../hooks';

export const FrogLayer: FC = () => {
  const setBulletPosition = useAction(gameActions.setBulletPosition);
  const setBulletState = useAction(gameActions.setBulletState);
  const setBulletColor = useAction(gameActions.setBulletColor);

  const bulletState = useSelector(getBulletState);
  const gamePhase = useSelector(getGamePhase);
  const bulletPosition = useSelector(getBulletPosition);
  const level = useSelector(getCurrentLevel);
  const remainColors = useSelector(getRemainColors);
  const angle = useSelector(getAngle);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeoutRef = useRef<number>();
  const requestRef = useRef<number>();

  const frog = useMemo(() => new Frog(), []);
  const bullet = useMemo(() => new Ball(), []);

  const drawFrog = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    ctx.translate(levels[level].frogPosition.x, levels[level].frogPosition.y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.translate(-FROG_RADIUS, -FROG_RADIUS);
    ctx.drawImage(frog.image, 0, 0, FROG_RADIUS * 2, FROG_RADIUS * 2);

    if (bulletState === BULLET_STATE.ARMING || bulletState === BULLET_STATE.ARMED) {
      if (bulletState === BULLET_STATE.ARMING) {
        bullet.update(bulletPosition + bullet.rotationOffset, Math.PI * 1.5);
      }
      coverWithLip(bullet.ctx, BALL_RADIUS, bulletPosition - 35, 40);
      ctx.drawImage(bullet.canvas, 35, -bulletPosition + 25);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    if (bulletState === BULLET_STATE.ARMING) {
      // выкатываем шар из брюха
      if (bulletPosition < BULLET_ARMED_POSITION) {
        timeoutRef.current = window.setTimeout(() => {
          setBulletPosition(bulletPosition + 1);
        }, fps(BULLET_ARMING_SPEED));
      } else {
        setBulletState(BULLET_STATE.ARMED);
      }
    }
    requestRef.current = window.requestAnimationFrame(drawFrog);
  }, [bulletPosition]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    requestRef.current = window.requestAnimationFrame(drawFrog);
  }, [angle]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    if (bulletState === BULLET_STATE.ARMING) {
      bullet.color = remainColors[random(remainColors.length)];
      bullet.rotationOffset = random(bullet.numberOfFrames);
      setBulletColor(bullet.color);
      setBulletPosition(BULLET_START_POSITION + 1);
    }
    if (gamePhase === GAME_PHASE.STARTED && bulletState !== BULLET_STATE.ARMED && bulletState !== BULLET_STATE.ARMING) {
      setBulletPosition(BULLET_START_POSITION);
    }
    if (gamePhase === GAME_PHASE.STARTED) {
      requestRef.current = window.requestAnimationFrame(drawFrog);
    }
  }, [bulletState]);

  useEffect(() => {
    if (gamePhase === GAME_PHASE.ENDING) {
      setBulletState(BULLET_STATE.IDLE);
    }
    if (gamePhase === GAME_PHASE.STARTED) {
      setBulletState(BULLET_STATE.ARMING);
    }
    requestRef.current = window.requestAnimationFrame(drawFrog);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gamePhase]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Frog canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    requestRef.current = window.requestAnimationFrame(drawFrog);
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
