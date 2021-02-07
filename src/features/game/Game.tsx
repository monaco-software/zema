import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import b_ from 'b_';

const block = b_.lock('game');

export const Game: FC = () => {
  const history = useHistory();

  return (
    <div className={block()}>
      Game page
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
