import './fullscreen-button.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { gameActions } from '../reducer';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { Contract, Expand } from 'grommet-icons';
import { getFullscreenState } from '../selectors';

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
