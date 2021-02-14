import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import b_ from 'b_';
import { useAuth } from '../../hooks';

const block = b_.lock('leaderboard');

export const Leaderboard: FC = () => {
  useAuth();

  const history = useHistory();

  return (
    <div className={block()}>
      Leaderboard
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
