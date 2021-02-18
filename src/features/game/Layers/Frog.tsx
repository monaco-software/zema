/* eslint prefer-const: "warn" */
// Модуль отображает лягушку

import React, { FC, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import bullet from '../lib/bullet';
import { fps, random } from '../lib/utils';
import { coverWithLip } from './utils/frog';

import { BULLET_SPEED } from '../setup';

export const FrogLayer: FC = () => {
  const dispatch = useDispatch();

  const bulletState = useSelector(getBulletState);
  const gamePhase = useSelector(getGamePhase);
  const bulletPosition = useSelector(getBulletPosition);
  const level = useSelector(getCurrentLevel);
  const remainColors = useSelector(getRemainColors);
  const angle = useSelector(getAngle);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frog = useMemo(() => new Frog(), []);

  const drawFrog = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) { return; }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    ctx.translate(levels[level].frogPosition.x, levels[level].frogPosition.y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.translate(-FROG_RADIUS, -FROG_RADIUS);

    ctx.drawImage(frog.image, 0, 0, FROG_RADIUS * 2, FROG_RADIUS * 2);
    if (bulletState === BULLET_STATE.ARMING || bulletState === BULLET_STATE.ARMED) {
      bullet.update(bulletPosition + bullet.positionOffset, Math.PI * 1.5);
      coverWithLip(bullet.ctx, BALL_RADIUS, bulletPosition - 35, 40);
      ctx.drawImage(bullet.canvas, 35, -bulletPosition + 25);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) { return; }
    if (bulletState === BULLET_STATE.ARMING) {
      // выкатываем шар из брюха
      if (bulletPosition < BULLET_ARMED_POSITION) {
        setTimeout(() => {
          dispatch(gameActions.setBulletPosition(bulletPosition + 1));
        }, fps(BULLET_SPEED));
      } else {
        dispatch(gameActions.setBulletState(BULLET_STATE.ARMED));
      }
    }
    drawFrog();
  }, [bulletPosition]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) { return; }
    drawFrog();
  }, [angle]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) { return; }
    if (bulletState === BULLET_STATE.ARMING) {
      bullet.color = remainColors[random(remainColors.length)];
      bullet.positionOffset = random(bullet.numberOfFrames);
      dispatch(gameActions.setBulletPosition(BULLET_START_POSITION));
    }
    if (bulletState === BULLET_STATE.IDLE) {
      bullet.position = BULLET_START_POSITION;
    }
    drawFrog();
  }, [bulletState]);

  useEffect(() => {
    if (gamePhase === GAME_PHASE.ENDING) {
      dispatch(gameActions.setBulletState(BULLET_STATE.IDLE));
    }
    if (gamePhase === GAME_PHASE.STARTED) {
      dispatch(gameActions.setBulletState(BULLET_STATE.ARMING));
    }
    drawFrog();
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
    if (!ctx) { return; }
    drawFrog();
  }, []);

  return (
    <canvas
      style={{ position: 'absolute' }}
      ref={canvasRef}
    />
  );
};
