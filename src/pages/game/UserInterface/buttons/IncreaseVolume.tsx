import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gameActions } from '../../reducer';
import { ICONS } from '@pages/game/Layers/utils/buttons';
import { useAction, useAsyncAction } from '@common/hooks';
import { playSound, SOUNDS } from '@pages/game/lib/sound';
import { asyncGameActions } from '@pages/game/asyncActions';
import { GAME_PHASE, MAX_VOLUME, VOLUME_STEP } from '@pages/game/constants';
import { useButtonStyle } from '@pages/game/UserInterface/utils/button-style';
import {
  getGamePhase,
  getIncreaseVolumeButton,
  getMuteState,
  getVolume,
} from '../../selectors';

interface Props {
  ratio: number;
  x: number;
  y: number;
}

export const IncreaseVolumeButton: FC<Props> = ({ ratio, x, y }) => {
  const setIncreaseVolumeButton = useAction(
    gameActions.setIncreaseVolumeButton
  );

  const increaseVolumeButton = useSelector(getIncreaseVolumeButton);
  const muteState = useSelector(getMuteState);
  const volume = useSelector(getVolume);
  const gamePhase = useSelector(getGamePhase);

  const sendVolume = useAsyncAction(asyncGameActions.sendVolume);

  const style = useButtonStyle(x, y, ratio);

  const disabled =
    muteState || volume >= MAX_VOLUME || gamePhase === GAME_PHASE.PAUSED;

  const increaseVolume = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (disabled) {
      return;
    }
    const newVolume = volume + VOLUME_STEP;
    if (newVolume <= MAX_VOLUME) {
      sendVolume(newVolume).catch(console.error);
    }
    playSound(SOUNDS.MISS);
  };

  const handleMouseEnter = () => {
    if (disabled) {
      return;
    }
    setIncreaseVolumeButton({ ...increaseVolumeButton, hovered: true });
  };

  const handleMouseLeave = () => {
    setIncreaseVolumeButton({ ...increaseVolumeButton, hovered: false });
  };

  useEffect(() => {
    setIncreaseVolumeButton({
      x,
      y,
      hovered: false,
      icon: ICONS.INCREASE_VOLUME,
    });
  }, []);

  return (
    <div
      onClick={increaseVolume}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    />
  );
};
