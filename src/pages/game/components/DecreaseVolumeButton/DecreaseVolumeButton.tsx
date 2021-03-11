import './decrease-volume-button.css';
import b_ from 'b_';
import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gameActions } from '../../reducer';
import { useAction, useAsyncAction } from '@common/hooks';
import { playSound, SOUNDS } from '@pages/game/lib/sound';
import { asyncGameActions } from '@pages/game/asyncActions';
import { MIN_VOLUME, VOLUME_STEP } from '@pages/game/constants';
import { BUTTON_RADIUS, ICONS } from '@pages/game/Layers/utils/buttons';
import { getDecreaseVolumeButton, getMuteState, getVolume } from '../../selectors';

const block = b_.lock('decrease-volume-button');

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

  const sendVolume = useAsyncAction(asyncGameActions.sendVolume);

  const decreaseVolume = () => {
    const newVolume = volume - VOLUME_STEP;
    if (newVolume >= MIN_VOLUME) {
      sendVolume(newVolume).catch(console.error);
    }
  };

  const onDecreaseVolume = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (muteState || volume <= MIN_VOLUME) {
      return;
    }
    decreaseVolume();
    playSound(SOUNDS.MISS);
  };

  const handleMouseEnter = () => {
    if (muteState || volume === MIN_VOLUME) { return; }
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
      className={block()}
      onClick={onDecreaseVolume}
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
