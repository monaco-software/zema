import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const SignUp: FC = () => {
  const history = useHistory();

  return (
    <div className="SignUp">
      SignUp
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
