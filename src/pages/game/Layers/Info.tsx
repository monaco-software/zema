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
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    ctx.fillStyle = '#00000050';
    ctx.fillRect(0, FRAME.HEIGHT - 15, FRAME.WIDTH, FRAME.HEIGHT);

    const renderValue = (Ball.writeTime + Ball.readTime) / Ball.updates * 1000;
    const render = padWithSpaces('render: ' + renderValue.toFixed(2).toString(), 15);

    const updates = padWithSpaces('updates: ' + Ball.updates.toString(), 18);

    const writes = padWithSpaces('writes: ' + Ball.writes.toString(), 18);

    const hits = padWithSpaces('hits: ' + Ball.hits.toString(), 16);

    const hitRate =
      padWithSpaces('hits rate: ' + (Ball.hits / Ball.writes).toFixed(2).toString(), 20);

    const updatesValue = Ball.updates / (Ball.writeTime + Ball.readTime) * 1000;
    const updatesPerSecond = padWithSpaces('upd/sec:' + updatesValue.toFixed(2).toString(), 15);

    const message =
      render +
      updates +
      writes +
      hits +
      hitRate +
      updatesPerSecond;

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
