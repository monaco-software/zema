import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { gameActions } from '../../reducer';
import { ICONS } from '@pages/game/Layers/utils/buttons';
import { getFullscreenButton, getFullscreenState } from '../../selectors';
import { useButtonStyle } from '@pages/game/UserInterface/utils/button-style';

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

  const style = useButtonStyle(x, y, ratio);

  const setFullscreen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setFullscreenState(!fullscreenState);
    e.stopPropagation();
  };

  const handleMouseEnter = () => {
    setFullscreenButton({ ...fullscreenButton, hovered: true });
  };

  const handleMouseLeave = () => {
    setFullscreenButton({ ...fullscreenButton, hovered: false });
  };

  useEffect(() => {
    setFullscreenButton({
      ...fullscreenButton,
      icon: fullscreenState ? ICONS.CONTRACT : ICONS.EXPAND,
    });
  }, [fullscreenState]);

  useEffect(() => {
    setFullscreenButton({
      x,
      y,
      hovered: false,
      icon: fullscreenState ? ICONS.CONTRACT : ICONS.EXPAND,
    });
  }, []);

  return (
    <div
      onClick={setFullscreen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    />
  );
};
