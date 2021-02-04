import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const GameLevels: FC = () => {
  const history = useHistory();

  return (
    <div className="GameLevels">
      GameLevels page
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
