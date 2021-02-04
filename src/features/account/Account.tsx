import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { AccountForm } from './Components/Form/AccountForm';

export const Account: FC = () => {
  const history = useHistory();

  return (
    <div className="Account">
      Account
      <br />
      <AccountForm />
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
