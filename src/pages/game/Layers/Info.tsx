// Модуль отображает статистику красным

import React, { FC, useEffect, useRef } from 'react';

import { FRAME } from '../constants';
import { print } from '../lib/print';
import Ball from '../lib/ball';
import { padWithSpaces } from '../lib/utils';

export const InfoLayer: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<number>();
  const requestRef = useRef<number>();

  const draw = () => {
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx || !Ball.updates) {
      return;
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    ctx.fillStyle = '#00000050';
    ctx.fillRect(0, FRAME.HEIGHT - 15, FRAME.WIDTH, FRAME.HEIGHT);

    const renderValue = Math.floor(Ball.updateTime / Ball.updates * 1000 );

    const render = padWithSpaces(
      `one ball render:${renderValue} µs`, 30);

    const updates = padWithSpaces(`updates:${Ball.updates}`, 20);

    const cpusValue = Math.floor(Ball.updates / Ball.updateTime * 1000);
    const cpus = padWithSpaces(`updates/CPU second:${cpusValue}`, 30);

    const message =
      render +
      updates +
      cpus;

    print({
      ctx,
      color: '#FF0000',
      text: message,
      x: Math.floor(FRAME.WIDTH / 2 - message.length / 2 * 6),
      y: FRAME.HEIGHT - 10,
    });
  };

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Info canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      intervalRef.current = window.setInterval(() =>
        requestRef.current = requestAnimationFrame(draw), 200);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <canvas style={{ position: 'absolute', height: '100%', width: '100%' }}
      ref={canvasRef} />
  );
};
