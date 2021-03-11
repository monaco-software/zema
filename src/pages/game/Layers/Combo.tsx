// Модуль отображает сообщения комбо

import levels from '../levels';
import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getCombo, getCurrentLevel } from '../selectors';
import { decimalToHex, distort, fps } from '../lib/utils';
import { COMBO_DISPLAY_PHASES, FRAME } from '../constants';
import { COMBO_FONT_SIZE, COMBO_MESSAGE_SPEED } from '../setup';

export const ComboLayer: FC = () => {
  const combo = useSelector(getCombo);
  const level = useSelector(getCurrentLevel);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const comboDisplayPhase = useRef(0);
  const timeoutRef = useRef<number>();
  const requestRef = useRef<number>();

  const draw = () => {
    if (!canvasRef.current) { return; }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) { return; }

    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;

    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    if (combo >= 2 && comboDisplayPhase.current < COMBO_DISPLAY_PHASES) {
      const opacity = distort(208, COMBO_DISPLAY_PHASES, comboDisplayPhase.current, 0.75);
      ctx.fillStyle = `#FFFF00${decimalToHex(opacity)}`;

      let lineHeight = distort(COMBO_FONT_SIZE, COMBO_DISPLAY_PHASES, comboDisplayPhase.current, 0.75);
      lineHeight += combo * 5;
      ctx.font = `${lineHeight}px Bangers2`;
      let message = `x  ${combo}  combo`;

      let textWidth = ctx.measureText(message).width;
      ctx.fillText(message, canvasRef.current.width / 2 - textWidth / 2,
        levels[level].scorePosition.y);
    }

    if (comboDisplayPhase.current <= COMBO_DISPLAY_PHASES) {
      comboDisplayPhase.current += 1;
      timeoutRef.current = window.setTimeout(() => {
        requestRef.current = window.requestAnimationFrame(draw);
      }, fps(COMBO_MESSAGE_SPEED));
    }
  };

  useEffect(() => {
    if (combo >= 2) {
      comboDisplayPhase.current = 0;
      draw();
    }
  }, [combo]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Combo canvas not found');
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
