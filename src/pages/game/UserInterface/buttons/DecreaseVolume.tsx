import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gameActions } from '../../reducer';
import { ICONS } from '@pages/game/Layers/utils/buttons';
import { useAction, useAsyncAction } from '@common/hooks';
import { playSound, SOUNDS } from '@pages/game/lib/sound';
import { asyncGameActions } from '@pages/game/asyncActions';
import { GAME_PHASE, MIN_VOLUME, VOLUME_STEP } from '@pages/game/constants';
import { useButtonStyle } from '@pages/game/UserInterface/utils/button-style';
import { getDecreaseVolumeButton, getGamePhase, getMuteState, getVolume } from '../../selectors';

interface Props {
  ratio: number;
  x: number;
  y: number;
}

export const DecreaseVolumeButton: FC<Props> = ({ ratio, x, y }) => {
  const setDecreaseVolumeButton = useAction(gameActions.setDecreaseVolumeButton);

  const decreaseVolumeButton = useSelector(getDecreaseVolumeButton);
  const muteState = useSelector(getMuteState);
  const volume = useSelector(getVolume);
  const gamePhase = useSelector(getGamePhase);

  const sendVolume = useAsyncAction(asyncGameActions.sendVolume);

  const style = useButtonStyle(x, y, ratio);

  const disabled = muteState || volume <= MIN_VOLUME || gamePhase === GAME_PHASE.PAUSED;

  const decreaseVolume = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (disabled) { return; }
    const newVolume = volume - VOLUME_STEP;
    if (newVolume >= MIN_VOLUME) {
      sendVolume(newVolume).catch(console.error);
    }
    playSound(SOUNDS.MISS);
  };

  const handleMouseEnter = () => {
    if (disabled) { return; }
    setDecreaseVolumeButton({ ...decreaseVolumeButton, hovered: true });
  };

  const handleMouseLeave = () => {
    setDecreaseVolumeButton({ ...decreaseVolumeButton, hovered: false });
  };

  useEffect(() => {
    setDecreaseVolumeButton( {
      x,
      y,
      hovered: false,
      icon: ICONS.DECREASE_VOLUME,
    });
  }, []);

  return (
    <div
      onClick={decreaseVolume}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    />
  );
};
