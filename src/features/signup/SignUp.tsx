import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import b_ from 'b_';

const block = b_.lock('sign-up');

export const SignUp: FC = () => {
  const history = useHistory();

  return (
    <div className={block()}>
      SignUp
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
