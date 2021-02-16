/** eslint prefer-const: "error" */
// Модуль отображает рейтинг и сообщения

import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { BLACKOUT_INCREMENT, FRAME, GAME_PHASE } from '../constants';
import { getGamePhase } from '../selectors';
import { decimalToHex, fps } from '../lib/utils';

export const BlackoutLayer: FC = () => {
  const gamePhase = useSelector(getGamePhase);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [blackout, setBlackout] = useState(255);

  const doBlackout = (reverse = false) => {
    setTimeout(() => {
      reverse ?
        setBlackout(blackout - BLACKOUT_INCREMENT) :
        setBlackout(blackout + BLACKOUT_INCREMENT);
    }, fps(24));
  };

  const draw = () => {
    if (!canvasRef.current) { return; }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) { return; }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);

    // затемнение в начале
    if (gamePhase === GAME_PHASE.LOADED || gamePhase === GAME_PHASE.LOADING) {
      ctx.fillStyle = `#000000${decimalToHex(blackout)}`;
      ctx.fillRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
      if (blackout < BLACKOUT_INCREMENT) { return; }
      doBlackout(true);
    }

    // и конце
    if (gamePhase === GAME_PHASE.ENDED || gamePhase === GAME_PHASE.EXITING) {
      ctx.fillStyle = `#000000${decimalToHex(blackout)}`;
      ctx.fillRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
      if (blackout > 255 - BLACKOUT_INCREMENT) { return; }
      doBlackout();
    }
  };

  useEffect(() => {
    draw();
  }, [blackout]);

  useEffect(() => {
    draw();
  }, [gamePhase]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Blackout canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
  }, []);

  return (
    <canvas
      style={{ position: 'absolute' }}
      ref={canvasRef}
    />
  );
};
