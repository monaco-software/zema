import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { AccountForm } from './Components/Form/AccountForm';
import b_ from 'b_';
import { useAuth } from '../../hooks';

const block = b_.lock('account');

export const Account: FC = () => {
  useAuth();

  const history = useHistory();

  return (
    <div className={block()}>
      Account
      <br />
      <AccountForm />
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
