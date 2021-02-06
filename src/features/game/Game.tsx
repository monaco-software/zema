import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { BallsLayer } from './Layers/Balls';

export const Game: FC = () => {
  const history = useHistory();
  return (
    <div className="Game">
      <BallsLayer />
      <br />

      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
