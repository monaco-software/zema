import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import b_ from 'b_';

const block = b_.lock('leaderboard');

export const Leaderboard: FC = () => {
  const history = useHistory();

  return (
    <div className={block()}>
      Leaderboard
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
