/** eslint prefer-const: "error" */
// Модуль отображает сообщения на весь экран

import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { FRAME } from '../constants';
import { TITLE_FONT_SIZE } from '../setup';
import { getTitle } from '../selectors';

export const TitleLayer: FC = () => {
  const title = useSelector(getTitle);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = React.useRef<number>();

  const draw = () => {
    if (!canvasRef.current) { return; }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) { return; }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);

    if (title) {
      ctx.fillStyle = '#FFFFFFDD';
      ctx.textBaseline = 'top';
      const lineHeight = TITLE_FONT_SIZE + 10;
      ctx.font = `${TITLE_FONT_SIZE}px Bangers2, Arial`;

      const lines = title.split('\n');
      lines.forEach((line: string, index: number) => {
        const textWidth = ctx.measureText(line).width;
        ctx.fillText(line, (canvasRef.current as HTMLCanvasElement).width / 2 - textWidth / 2,
          (canvasRef.current as HTMLCanvasElement).height / 2 + index * lineHeight - lines.length * lineHeight / 2);
      });
    }
  };

  useEffect(() => {
    requestRef.current = window.requestAnimationFrame(draw);
  }, [title]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Title canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;

    return () => {
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
