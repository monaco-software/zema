import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const Game: FC = () => {
  const history = useHistory();

  return (
    <div className="Game">
      Game page
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
