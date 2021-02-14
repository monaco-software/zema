/** eslint prefer-const: "error" */
// Модуль отображает сообщения комбо

import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { COMBO_DISPLAY_PHASES, FRAME } from '../constants';
import { COMBO_FONT_SIZE } from '../setup';
import { getCombo, getCurrentLevel } from '../selectors';
import { decimalToHex, distort, fps } from '../lib/utils';
import levels from '../levels';

import '../assets/styles/Layer.css';

export const ComboLayer: FC = () => {
  const combo = useSelector(getCombo);
  const level = useSelector(getCurrentLevel);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const comboDisplayPhase = useRef(0);

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
      lineHeight += combo * 4;
      ctx.font = `${lineHeight}px Bangers, "Courier New"`;
      let message = `x  ${combo}  combo`;

      let textWidth = ctx.measureText(message).width;
      ctx.fillText(message, canvasRef.current.width / 2 - textWidth / 2,
        levels[level].scorePosition.y);
    }

    if (comboDisplayPhase.current <= COMBO_DISPLAY_PHASES) {
      comboDisplayPhase.current += 1;
      setTimeout(() => {
        window.requestAnimationFrame(draw);
      }, fps(32));
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
      throw new Error('Score canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      throw new Error('Score context not found');
    }
  }, []);

  return (
    <canvas className="Layer"
      ref={canvasRef} />
  );
};
