import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const Login: FC = () => {
  const history = useHistory();

  return (
    <div className="Login">
      Login
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
