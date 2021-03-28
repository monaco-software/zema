import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { gameActions } from '../../reducer';
import { GAME_PHASE } from '@pages/game/constants';
import { ICONS } from '@pages/game/Layers/utils/buttons';
import { getGamePhase, getPauseButton, getShotPath } from '../../selectors';
import { useButtonStyle } from '@pages/game/UserInterface/utils/button-style';

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
  const shotPath = useSelector(getShotPath);

  const style = useButtonStyle(x, y, ratio);

  const disabled =
    shotPath.length ||
    (gamePhase !== GAME_PHASE.STARTED && gamePhase !== GAME_PHASE.PAUSED);

  const setPause = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (disabled) {
      return;
    }

    if (gamePhase === GAME_PHASE.STARTED) {
      setPauseButton({ ...pauseButton, icon: ICONS.PLAY });
      setGamePhase(GAME_PHASE.PAUSED);
    }

    if (gamePhase === GAME_PHASE.PAUSED) {
      setPauseButton({ ...pauseButton, icon: ICONS.PAUSE });
      setGamePhase(GAME_PHASE.STARTED);
    }
  };

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
