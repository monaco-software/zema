import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { gameActions } from '../../reducer';
import { ICONS } from '@pages/game/Layers/utils/buttons';
import { BULLET_STATE, GAME_PHASE } from '@pages/game/constants';
import { useButtonStyle } from '@pages/game/UserInterface/utils/button-style';
import { getBulletState, getGamePhase, getPauseButton } from '../../selectors';

interface Props {
  ratio: number;
  x: number;
  y: number;
}

export const PauseButton: FC<Props> = ({ ratio, x, y }) => {
  const setGamePhase = useAction(gameActions.setGamePhase);
  const setPauseButton = useAction(gameActions.setPauseButton);

  const gamePhase = useSelector(getGamePhase);
  const pauseButton = useSelector(getPauseButton);
  const bulletState = useSelector(getBulletState);

  const style = useButtonStyle(x, y, ratio);

  const disabled = bulletState !== BULLET_STATE.ARMED;

  const setPause = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (disabled) {
      return;
    }

    if (gamePhase === GAME_PHASE.STARTED) {
      setGamePhase(GAME_PHASE.PAUSED);
    }

    if (gamePhase === GAME_PHASE.PAUSED) {
      setGamePhase(GAME_PHASE.STARTED);
    }
  };

  useEffect(() => {
    if (gamePhase === GAME_PHASE.STARTED) {
      setPauseButton({ ...pauseButton, icon: ICONS.PLAY });
    }

    if (gamePhase === GAME_PHASE.PAUSED) {
      setPauseButton({ ...pauseButton, icon: ICONS.PAUSE });
    }
  }, [gamePhase]);

  const handleMouseEnter = () => {
    if (disabled) {
      return;
    }
    setPauseButton({ ...pauseButton, hovered: true });
  };

  const handleMouseLeave = () => {
    setPauseButton({ ...pauseButton, hovered: false });
  };

  useEffect(() => {
    setPauseButton({
      x,
      y,
      hovered: false,
      icon: ICONS.PAUSE,
    });
  }, []);

  return (
    <div
      onClick={setPause}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    />
  );
};
