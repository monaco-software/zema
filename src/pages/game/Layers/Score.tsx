// Модуль отображает рейтинг

import levels from '../levels';
import React, { FC, useEffect, useRef } from 'react';
import { fps } from '../lib/utils';
import { FRAME } from '../constants';
import { useSelector } from 'react-redux';
import { getCurrentLevel, getScore } from '../selectors';
import { SCORE_FONT_SIZE, SCORE_ROLLING_SPEED } from '../setup';

export const ScoreLayer: FC = () => {
  const level = useSelector(getCurrentLevel);
  const score = useSelector(getScore);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scoreFontSize = useRef(SCORE_FONT_SIZE);
  const tmpScore = useRef(0);
  const timeoutRef = useRef<number>();
  const requestRef = useRef<number>();

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
      ctx.font = `${scoreFontSize.current}px Bangers2`;
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
      timeoutRef.current = window.setTimeout(() => {
        requestRef.current = window.requestAnimationFrame(draw);
      }, fps(SCORE_ROLLING_SPEED));
    }
  };

  useEffect(() => {
    if (score !== 0 ) {
      scoreFontSize.current = SCORE_FONT_SIZE + grow;
      requestRef.current = window.requestAnimationFrame(draw);
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
