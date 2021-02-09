import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { BallsLayer } from './Layers/Balls';
import { BackLayer } from './Layers/Back';
import { FrogLayer } from './Layers/Frog';
import b_ from 'b_';

const block = b_.lock('game');

export const Game: FC = () => {
  const history = useHistory();
  return (
    <div className={block()}>
      <BackLayer />
      <BallsLayer />
      <FrogLayer />
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
