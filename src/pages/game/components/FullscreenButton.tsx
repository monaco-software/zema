import './fullscreen-button.css';
import b_ from 'b_';
import React, { FC, useEffect } from 'react';
import { gameActions } from '../reducer';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { getFullscreenButton, getFullscreenState } from '../selectors';
import { BUTTON_RADIUS, ICONS } from '@pages/game/Layers/utils/buttons';

const block = b_.lock('fullscreen-button');

interface Props {
  ratio: number;
  x: number;
  y: number;
}

export const FullscreenButton: FC<Props> = ({ ratio, x, y }) => {
  const setFullscreenState = useAction(gameActions.setFullscreenState);
  const setFullscreenButton = useAction(gameActions.setFullscreenButton);

  const fullscreenState = useSelector(getFullscreenState);
  const fullscreenButton = useSelector(getFullscreenButton);

  const setFullscreen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setFullscreenButton(
      { ...fullscreenButton, icon: fullscreenState ? ICONS.EXPAND : ICONS.CONTRACT });
    setFullscreenState(!fullscreenState);
    e.stopPropagation();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setFullscreenButton({ ...fullscreenButton, hovered: true });
    e.stopPropagation();
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setFullscreenButton({ ...fullscreenButton, hovered: false });
    e.stopPropagation();
  };

  useEffect(() => {
    setFullscreenButton( {
      x,
      y,
      hovered: false,
      icon: fullscreenState ? ICONS.CONTRACT : ICONS.EXPAND,
    });
  }, []);

  return (
    <div
      className={block()}
      onClick={setFullscreen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        left: `${x * ratio}px`,
        top: `${y * ratio}px`,
        width: `${BUTTON_RADIUS * 2 * ratio}px`,
        height: `${BUTTON_RADIUS * 2 * ratio}px`,
      }}
    />
  );
};
