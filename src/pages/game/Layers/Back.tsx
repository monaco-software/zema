// Модуль отображает задник

import { useSelector } from 'react-redux';
import React, { FC, useEffect, useRef } from 'react';

import { FRAME } from '../constants';
import levels from '../levels';
import { getCurrentLevel } from '../selectors';

export const BackLayer: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const requestRef = useRef<number>();
  const backImage = useRef<HTMLImageElement>(new Image());

  const level = useSelector(getCurrentLevel);

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    ctx.drawImage(backImage.current, 0, 0);
  };

  const setBack = (src: string) => {
    backImage.current.src = src;
  };

  useEffect(() => {
    setBack(levels[level].background);
    requestRef.current = window.requestAnimationFrame(draw);
  }, [level]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Back canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;

    backImage.current.onload = () => {
      requestRef.current = window.requestAnimationFrame(draw);
    };
    setBack(levels[level].background);

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
