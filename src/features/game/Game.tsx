import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { BallsLayer } from './Layers/Balls';
import { BackLayer } from './Layers/Back';
import { FrogLayer } from './Layers/Frog';
// import { ScoresLayer } from './Layers/Scores';

export const Game: FC = () => {
  const history = useHistory();
  return (
    <div className="Game">
      <BackLayer />
      <BallsLayer />
      {/* <ScoresLayer />*/}
      <FrogLayer />
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
