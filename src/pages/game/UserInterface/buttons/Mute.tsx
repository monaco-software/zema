import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { gameActions } from '../../reducer';
import { GAME_PHASE } from '@pages/game/constants';
import { ICONS } from '@pages/game/Layers/utils/buttons';
import { mute, playSound, setVolume, SOUNDS } from '@pages/game/lib/sound';
import { useButtonStyle } from '@pages/game/UserInterface/utils/button-style';
import {
  getGamePhase,
  getMuteButton,
  getMuteState,
  getVolume,
} from '../../selectors';

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
  const gamePhase = useSelector(getGamePhase);

  const style = useButtonStyle(x, y, ratio);

  const disabled = gamePhase === GAME_PHASE.PAUSED;

  const setMute = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (disabled) {
      return;
    }
    setMuteState(!muteState);
    setMuteButton({
      ...muteButton,
      icon: muteState ? ICONS.MUTE : ICONS.SOUND,
    });
    if (!muteState) {
      mute();
      return;
    }
    setVolume(volume);
    playSound(SOUNDS.MISS);
  };

  const handleMouseEnter = () => {
    if (disabled) {
      return;
    }
    setMuteButton({ ...muteButton, hovered: true });
  };

  const handleMouseLeave = () => {
    setMuteButton({ ...muteButton, hovered: false });
  };

  useEffect(() => {
    setMuteButton({
      x,
      y,
      hovered: false,
      icon: muteState ? ICONS.SOUND : ICONS.MUTE,
    });
  }, []);

  return (
    <div
      onClick={setMute}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    />
  );
};
