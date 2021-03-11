import './pause-button.css';
import b_ from 'b_';
import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { gameActions } from '../../reducer';
import { GAME_PHASE } from '@pages/game/constants';
import { BUTTON_RADIUS, ICONS } from '@pages/game/Layers/utils/buttons';
import { getGamePhase, getPauseButton, getShotPath } from '../../selectors';

const block = b_.lock('pause-button');

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

  const setPause = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (shotPath.length) { return; }

    if (gamePhase === GAME_PHASE.STARTED) {
      setPauseButton({ ...pauseButton, icon: ICONS.PLAY });
      setGamePhase(GAME_PHASE.PAUSED);
    }

    if (gamePhase === GAME_PHASE.PAUSED) {
      setPauseButton({ ...pauseButton, icon: ICONS.PAUSE });
      setGamePhase(GAME_PHASE.STARTED);
    }
    e.stopPropagation();
  };

  const handleMouseEnter = () => {
    setPauseButton({ ...pauseButton, hovered: true });
  };

  const handleMouseLeave = () => {
    setPauseButton({ ...pauseButton, hovered: false });
  };

  useEffect(() => {
    setPauseButton( {
      x,
      y,
      hovered: false,
      icon: ICONS.PAUSE,
    });
  }, []);

  return (
    <div
      className={block()}
      onClick={setPause}
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
