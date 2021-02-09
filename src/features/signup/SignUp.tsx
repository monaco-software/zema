import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import b_ from 'b_';
import { useAuth } from '../../hooks';

const block = b_.lock('sign-up');

export const SignUp: FC = () => {
  useAuth(false);

  const history = useHistory();

  return (
    <div className={block()}>
      SignUp
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
