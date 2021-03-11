import './increase-volume-button.css';
import b_ from 'b_';
import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gameActions } from '../../reducer';
import { useAction, useAsyncAction } from '@common/hooks';
import { playSound, SOUNDS } from '@pages/game/lib/sound';
import { asyncGameActions } from '@pages/game/asyncActions';
import { MAX_VOLUME, VOLUME_STEP } from '@pages/game/constants';
import { BUTTON_RADIUS, ICONS } from '@pages/game/Layers/utils/buttons';
import { getIncreaseVolumeButton, getMuteState, getVolume } from '../../selectors';

const block = b_.lock('increase-volume-button');

interface Props {
  ratio: number;
  x: number;
  y: number;
}

export const IncreaseVolumeButton: FC<Props> = ({ ratio, x, y }) => {
  const setIncreaseVolumeButton = useAction(gameActions.setIncreaseVolumeButton);

  const increaseVolumeButton = useSelector(getIncreaseVolumeButton);
  const muteState = useSelector(getMuteState);
  const volume = useSelector(getVolume);

  const sendVolume = useAsyncAction(asyncGameActions.sendVolume);

  const increaseVolume = () => {
    const newVolume = volume + VOLUME_STEP;
    if (newVolume <= MAX_VOLUME) {
      sendVolume(newVolume).catch(console.error);
    }
  };

  const onIncreaseVolume = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (muteState || volume >= MAX_VOLUME) { return; }
    increaseVolume();
    playSound(SOUNDS.MISS);
  };

  const handleMouseEnter = () => {
    if (muteState || volume >= MAX_VOLUME) { return; }
    setIncreaseVolumeButton({ ...increaseVolumeButton, hovered: true });
  };

  const handleMouseLeave = () => {
    setIncreaseVolumeButton({ ...increaseVolumeButton, hovered: false });
  };

  useEffect(() => {
    setIncreaseVolumeButton( {
      x,
      y,
      hovered: false,
      icon: ICONS.INCREASE_VOLUME,
    });
  }, []);

  return (
    <div
      className={block()}
      onClick={onIncreaseVolume}
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
