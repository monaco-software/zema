import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const GameOver: FC = () => {
  const history = useHistory();

  return (
    <div className="GameOver">
      GameOver page
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
