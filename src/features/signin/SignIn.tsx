import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const SignIn: FC = () => {
  const history = useHistory();

  return (
    <div className="SignIn">
      SignIn
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
