// Модуль взаимодействует с пользователем
// слушает мышь и рассчитывает путь пули

// слушает мышь и рассчитывает путь пули
import levels from '../levels';
// слушает мышь и рассчитывает путь пули
// слушает мышь и рассчитывает путь пули
import React, { FC, useEffect, useRef } from 'react';
import { gameActions } from '../reducer';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { BULLET_TICK_DISTANCE } from '../setup';
import { BULLET_STATE, FRAME, FROG_RADIUS, GAME_PHASE } from '../constants';
import { getBulletState, getCurrentLevel, getGamePhase } from '../selectors';

export const UiLayer: FC = () => {
  const resetCombo = useAction(gameActions.resetCombo);
  const setBulletState = useAction(gameActions.setBulletState);
  const setAngle = useAction(gameActions.setAngle);
  const setShotPath = useAction(gameActions.setShotPath);

  const bulletState = useSelector(getBulletState);
  const level = useSelector(getCurrentLevel);
  const gamePhase = useSelector(getGamePhase);

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
    setShotPath(path);
  };

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (gamePhase === GAME_PHASE.LOADING || gamePhase === GAME_PHASE.EXITING) {
      return;
    }
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.pageX - rect.left - levels[level].frogPosition.x;
    const y = e.pageY - rect.top - levels[level].frogPosition.y;
    angle.current = Math.atan2(y, x);

    setAngle(angle.current);
  };

  const mouseClick = () => {
    if (bulletState !== BULLET_STATE.ARMED) {
      return;
    }
    calculateShotPath();
    resetCombo();
    setBulletState(BULLET_STATE.SHOT);
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
    <canvas
      style={{ position: 'absolute' }}
      ref={canvasRef}
      onMouseMove={mouseMove}
      onClick={mouseClick}
    />
  );
};
