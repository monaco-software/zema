/** eslint prefer-const: "error" */
// Модуль отображает рейтинг

import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { FRAME } from '../constants';
import { SCORE_FONT_SIZE } from '../setup';
import { getCurrentLevel, getScore } from '../selectors';
import levels from '../levels';
import { fps } from '../lib/utils';

import '../assets/styles/Layer.css';

export const ScoreLayer: FC = () => {
  const level = useSelector(getCurrentLevel);
  const score = useSelector(getScore);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scoreFontSize = useRef(SCORE_FONT_SIZE);
  const tmpScore = useRef(0);
  const grow = 10;

  const draw = () => {
    if (!canvasRef.current) { return; }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) { return; }

    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);

    if (tmpScore.current) {
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#FFFF00D0';
      ctx.font = `${scoreFontSize.current}px Bangers, "Courier New"`;
      ctx.textBaseline = 'middle';
      const textWidth = ctx.measureText(tmpScore.current.toString()).width;
      ctx.fillText(tmpScore.current.toString(),
        levels[level].scorePosition.x - textWidth / 2,
        levels[level].scorePosition.y + (scoreFontSize.current - SCORE_FONT_SIZE) / 2);
      if (scoreFontSize.current > SCORE_FONT_SIZE) {
        scoreFontSize.current -= 1;
      }
    }
    if (tmpScore.current < score ) {
      // крутилка должна быстро догонять реальный счетчик
      const diff = score - tmpScore.current;
      if (diff > 10) {
        tmpScore.current += 10;
      } else {
        tmpScore.current += 1;
      }
    }
    // если еще нужно что-то анимировать
    if (tmpScore.current < score || scoreFontSize.current > SCORE_FONT_SIZE ) {
      setTimeout(() => {
        window.requestAnimationFrame(draw);
      }, fps(32));
    }
  };

  useEffect(() => {
    if (score !== 0 ) {
      scoreFontSize.current = SCORE_FONT_SIZE + grow;
      draw();
    }
  }, [score]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Score canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
  }, []);

  return (
    <canvas className="Layer"
      ref={canvasRef} />
  );
};