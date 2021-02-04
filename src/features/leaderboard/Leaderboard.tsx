import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const Leaderboard: FC = () => {
  const history = useHistory();

  return (
    <div className="Leaderboard">
      Leaderboard
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
