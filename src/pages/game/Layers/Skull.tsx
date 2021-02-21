// Модуль отображает череп

import { useSelector } from 'react-redux';
import React, { FC, useEffect, useRef } from 'react';

import { FRAME, SKULL_RADIUS } from '../constants';
import { getCurrentLevel } from '../selectors';
import Skull from '../lib/skull';
import levels from '../levels';

export const SkullLayer: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const skull = useRef(new Skull());
  const requestRef = useRef<number>();

  const level = useSelector(getCurrentLevel);

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 15;

    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    ctx.drawImage(skull.current.image, levels[level].skullPosition.x - SKULL_RADIUS, levels[level].skullPosition.y - SKULL_RADIUS);
  };

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Skull canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    skull.current.image.onload = () => {
      requestRef.current = window.requestAnimationFrame(draw);
    };

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
