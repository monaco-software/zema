// Модуль отображает кнопки

import React, { FC, useEffect, useRef } from 'react';
import { FRAME } from '../constants';
import { useSelector } from 'react-redux';
import { BUTTON_RADIUS, ICON_RADIUS } from '@pages/game/Layers/utils/buttons';
import {
  getDecreaseVolumeButton,
  getFullscreenButton,
  getIncreaseVolumeButton,
  getMuteButton,
  getPauseButton,
} from '@pages/game/selectors';

export const ButtonsLayer: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number>();
  const fullscreenButton = useSelector(getFullscreenButton);
  const pauseButton = useSelector(getPauseButton);
  const muteButton = useSelector(getMuteButton);
  const increaseVolumeButton = useSelector(getIncreaseVolumeButton);
  const decreaseVolumeButton = useSelector(getDecreaseVolumeButton);

  const buttons = [
    fullscreenButton,
    pauseButton,
    muteButton,
    increaseVolumeButton,
    decreaseVolumeButton,
  ];

  const draw = () => {
    if (!canvasRef.current) { return; }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) { return; }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#000';

    buttons.forEach( (button) => {
      if (button.hovered) {
        ctx.shadowOffsetX = -2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#FFFF00E0';
      } else {
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 4;
        ctx.strokeStyle = '#FFFF00C0';
      }

      ctx.translate(
        button.x - ICON_RADIUS + BUTTON_RADIUS,
        button.y - ICON_RADIUS + BUTTON_RADIUS
      );
      const p = new Path2D(button.icon);
      ctx.stroke(p);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    });
  };

  useEffect(() => {
    requestRef.current = window.requestAnimationFrame(draw);
  },
  [
    fullscreenButton,
    pauseButton,
    muteButton,
    increaseVolumeButton,
    decreaseVolumeButton,
  ]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Title canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    requestRef.current = window.requestAnimationFrame(draw);
    return () => {
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
