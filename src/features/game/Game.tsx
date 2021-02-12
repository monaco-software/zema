import React, { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { BallsLayer } from './Layers/Balls';
import { BackLayer } from './Layers/Back';
import { EffectsLayer } from './Layers/Effects';
import { FrogLayer } from './Layers/Frog';
import b_ from 'b_';
import { getPath } from './lib/geometry';
import { useSelector } from 'react-redux';
import { getCurrentLevel } from './selectors';
import levels from './levels';

const block = b_.lock('game');

export const Game: FC = () => {
  const level = useSelector(getCurrentLevel);

  const ballsPath = useMemo(() => getPath(levels[level].start, levels[level].curve), []);

  const history = useHistory();
  return (
    <div className={block()}>
      <BackLayer />
      <BallsLayer ballsPath={ballsPath} />
      <EffectsLayer ballsPath={ballsPath} />
      <FrogLayer />
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
