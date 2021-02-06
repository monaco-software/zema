import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { BallsLayer } from './Layers/Balls';
import { BackLayer } from './Layers/Back';

export const Game: FC = () => {
  const history = useHistory();
  return (
    <div className="Game">
      <BackLayer />
      <BallsLayer />
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
