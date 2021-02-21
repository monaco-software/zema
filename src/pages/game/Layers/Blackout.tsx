// Модуль отображает рейтинг и сообщения

import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { BLACKOUT_INCREMENT, FRAME, GAME_PHASE } from '../constants';
import { getGamePhase } from '../selectors';
import { decimalToHex, fps } from '../lib/utils';
import { DEFAULT_FRAMERATE } from '../setup';

export const BlackoutLayer: FC = () => {
  const gamePhase = useSelector(getGamePhase);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeoutRef = useRef<number>();
  const requestRef = useRef<number>();

  const [blackout, setBlackout] = useState(255);

  const doBlackout = (reverse = false) => {
    timeoutRef.current = window.setTimeout(() => {
      reverse ?
        setBlackout(blackout - BLACKOUT_INCREMENT) :
        setBlackout(blackout + BLACKOUT_INCREMENT);
    }, fps(DEFAULT_FRAMERATE));
  };

  const draw = () => {
    if (!canvasRef.current) { return; }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) { return; }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);

    // затемнение в начале
    if (gamePhase === GAME_PHASE.LOADED) {
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
    if (gamePhase < GAME_PHASE.LOADED) { return; }
    requestRef.current = window.requestAnimationFrame(draw);
  }, [gamePhase, blackout]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Blackout canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) { return; }
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);

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
