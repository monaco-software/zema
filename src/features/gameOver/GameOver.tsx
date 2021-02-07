import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import b_ from 'b_';

const block = b_.lock('game-over');

export const GameOver: FC = () => {
  const history = useHistory();

  return (
    <div className={block()}>
      GameOver page
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
