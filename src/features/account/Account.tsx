import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const Account: FC = () => {
  const history = useHistory();

  return (
    <div className="Account">
      Account
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
