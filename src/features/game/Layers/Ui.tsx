/** eslint prefer-const: "error" */
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import levels from '../levels';
import { BULLET_SPEED, BULLET_STATE, FRAME, FROG_RADIUS, GAME_PHASE } from '../constants';
import { gameActions } from '../reducer';
import { getBulletState, getCurrentLevel, getGamePhase, getTitle } from '../selectors';

import '../assets/styles/Layer.css';
import { decimalToHex } from '../lib/utils';

export const UiLayer: FC = () => {
  const dispatch = useDispatch();

  const bulletState = useSelector(getBulletState);
  const gamePhase = useSelector(getGamePhase);
  const level = useSelector(getCurrentLevel);
  const title = useSelector(getTitle);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angle = useRef(0);
  const [blackout, setBlackout] = useState(255);

  const calculateShotPath = () => {
    // рассчитываем путь
    const path: number[][] = [];
    const shotAngle = angle.current - Math.PI / 2;
    for (let i = FROG_RADIUS + BULLET_SPEED; i < FRAME.WIDTH; i += BULLET_SPEED) {
      const x = Math.round(levels[level].frogPosition.x + i * Math.cos(shotAngle));
      const y = Math.round(levels[level].frogPosition.y + i * Math.sin(shotAngle));
      if (x >= 0 && x <= FRAME.WIDTH && y >= 0 && y <= FRAME.HEIGHT) {
        path.push([x, y, shotAngle]);
      }
    }
    dispatch(gameActions.setShotPath(path));
  };

  const doBlackout = (reverse = false) => {
    setTimeout(() => {
      reverse ? setBlackout(blackout - 4) : setBlackout(blackout + 4);
    }, 20);
  };

  const draw = () => {
    if (!canvasRef.current) { return; }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) { return; }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);

    // затемнение в начале и конце
    if (gamePhase === GAME_PHASE.LOADED && blackout > 0) {
      doBlackout(true);
    }
    if (gamePhase === GAME_PHASE.ENDED && blackout < 255) {
      doBlackout();
    }
    if (gamePhase === GAME_PHASE.LOADING || gamePhase === GAME_PHASE.LOADED
      || gamePhase === GAME_PHASE.EXITING || gamePhase === GAME_PHASE.ENDED) {
      ctx.fillStyle = `#000000${decimalToHex(blackout)}`;
      ctx.fillRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    }

    if (title) {
      ctx.fillStyle = '#FFFFFFBB';
      const lineHeight = 40;
      ctx.font = `${lineHeight}px Bangers, "Courier New"`;
      let lines = title.split('\n');
      lines.forEach((line, index) => {
        let textWidth = ctx.measureText(line).width;
        ctx.fillText(line, (canvasRef.current as HTMLCanvasElement) .width / 2 - textWidth / 2,
          (canvasRef.current as HTMLCanvasElement).height / 2 + index * lineHeight);
      });
    }
  };

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const y = levels[level].frogPosition.x - e.pageX;
    const x = e.pageY - levels[level].frogPosition.y;
    angle.current = Math.atan2(y, x) + Math.PI;
    dispatch(gameActions.setAngle(angle.current));
  };

  const mouseClick = () => {
    if (bulletState !== BULLET_STATE.ARMED) {
      return;
    }
    calculateShotPath();
    dispatch(gameActions.setBulletState(BULLET_STATE.SHOT));
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    draw();
  }, [gamePhase, blackout]);

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
    <canvas className="Layer"
      ref={canvasRef}
      onMouseMove={mouseMove}
      onClick={mouseClick} />
  );
};
