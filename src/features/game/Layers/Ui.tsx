/** eslint prefer-const: "error" */
// Модуль взаимодействует с пользователем
// слушает мышь и рассчитывает путь пули

import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BULLET_STATE, FRAME, FROG_RADIUS } from '../constants';
import { BULLET_TICK_DISTANCE } from '../setup';
import { gameActions } from '../reducer';
import { getBulletState, getCurrentLevel } from '../selectors';
import levels from '../levels';

export const UiLayer: FC = () => {
  const dispatch = useDispatch();

  const bulletState = useSelector(getBulletState);
  const level = useSelector(getCurrentLevel);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angle = useRef(0);

  const calculateShotPath = () => {
    // рассчитываем путь
    const path: number[][] = [];
    const shotAngle = angle.current;
    for (let i = FROG_RADIUS + BULLET_TICK_DISTANCE; i < FRAME.WIDTH; i += BULLET_TICK_DISTANCE) {
      const x = Math.round(levels[level].frogPosition.x + i * Math.cos(shotAngle));
      const y = Math.round(levels[level].frogPosition.y + i * Math.sin(shotAngle));
      if (x >= 0 && x <= FRAME.WIDTH && y >= 0 && y <= FRAME.HEIGHT) {
        path.push([x, y, shotAngle]);
      }
    }
    dispatch(gameActions.setShotPath(path));
  };

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.pageX - rect.left - levels[level].frogPosition.x;
    const y = e.pageY - rect.top - levels[level].frogPosition.y;

    angle.current = Math.atan2(y, x);
    dispatch(gameActions.setAngle(angle.current));
  };

  const mouseClick = () => {
    if (bulletState !== BULLET_STATE.ARMED) {
      return;
    }
    calculateShotPath();
    dispatch(gameActions.resetCombo());
    dispatch(gameActions.setBulletState(BULLET_STATE.SHOT));
  };

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('UI canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      throw new Error('UI context not found');
    }
  }, []);

  return (
    <canvas style={{ position: 'absolute' }}
      ref={canvasRef}
      onMouseMove={mouseMove}
      onClick={mouseClick} />
  );
};
