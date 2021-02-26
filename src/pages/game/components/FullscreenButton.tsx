import './fullscreen-button.css';

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Contract, Expand } from 'grommet-icons';
import b_ from 'b_';

import { gameActions } from '../reducer';
import { getFullscreenState } from '../selectors';
import { useAction } from '../../../hooks';

const block = b_.lock('fullscreen-button');

interface Props {
  ratio: number;
  top: number;
  right: number;
}

export const FullscreenButton: FC<Props> = ({ ratio, top, right }) => {
  const setFullscreenState = useAction(gameActions.setFullscreenState);

  const fullscreenState = useSelector(getFullscreenState);

  const setFullscreen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setFullscreenState(!fullscreenState);
    e.stopPropagation();
  };

  return (
    <div
      className={block()}
      onClick={setFullscreen}
      style={{
        top: `${ratio * top}px`,
        right: `${ratio * right}px`,
        width: `${ratio * 40}px`,
        height: `${ratio * 40}px`,
        padding: `${ratio * 10}px`,
        backgroundImage:
          `radial-gradient(
           circle at ${ratio * 15}px ${ratio * 15}px,
           var(--brand), #000)`,
      }}
    >
      {
        fullscreenState ?
          <Contract size={`${ratio * 20}px`} color="#FFF" /> :
          <Expand size={`${ratio * 20}px`} color="#FFF" />
      }
    </div>
  );
};
