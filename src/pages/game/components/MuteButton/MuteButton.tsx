import './mute-button.css';
import b_ from 'b_';
import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { gameActions } from '../../reducer';
import { mute, setVolume } from '@pages/game/lib/sound';
import { BUTTON_RADIUS, ICONS } from '@pages/game/Layers/utils/buttons';
import { getMuteButton, getMuteState, getVolume } from '../../selectors';

const block = b_.lock('mute-button');

interface Props {
  ratio: number;
  x: number;
  y: number;
}

export const MuteButton: FC<Props> = ({ ratio, x, y }) => {
  const setMuteButton = useAction(gameActions.setMuteButton);
  const setMuteState = useAction(gameActions.setMuteState);

  const volume = useSelector(getVolume);
  const muteButton = useSelector(getMuteButton);
  const muteState = useSelector(getMuteState);

  const setMute = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setMuteState(!muteState);
    setMuteButton({ ...muteButton, icon: muteState ? ICONS.MUTE : ICONS.SOUND });
    if (!muteState) {
      mute();
      return;
    }
    setVolume(volume);
  };

  const handleMouseEnter = () => {
    setMuteButton({ ...muteButton, hovered: true });
  };

  const handleMouseLeave = () => {
    setMuteButton({ ...muteButton, hovered: false });
  };

  useEffect(() => {
    setMuteButton( {
      x,
      y,
      hovered: false,
      icon: muteState ? ICONS.SOUND : ICONS.MUTE,
    });
  }, []);

  return (
    <div
      className={block()}
      onClick={setMute}
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
