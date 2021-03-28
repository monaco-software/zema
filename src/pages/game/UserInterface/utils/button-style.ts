import React from 'react';
import { BUTTON_RADIUS } from '@pages/game/Layers/utils/buttons';

export const useButtonStyle = (
  x: number,
  y: number,
  ratio: number
): React.CSSProperties => {
  const left = `${x * ratio}px`;
  const top = `${y * ratio}px`;
  const sideLength = `${BUTTON_RADIUS * 2 * ratio}px`;

  return {
    left,
    top,
    width: sideLength,
    height: sideLength,
    display: 'inline-block',
    borderRadius: '50%',
    lineHeight: 0,
    cursor: 'pointer',
    position: 'absolute',
  };
};
