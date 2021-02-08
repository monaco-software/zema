import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import b_ from 'b_';

const block = b_.lock('sign-in');

export const SignIn: FC = () => {
  const history = useHistory();

  return (
    <div className={block()}>
      SignIn
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
