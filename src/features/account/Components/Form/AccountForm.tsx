import './AccountForm.css';
import React, { ChangeEvent, FC, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountEmail, getAccountName } from '../../selectors';
import { accountActions } from '../../reducer';

export const AccountForm: FC = () => {
  const dispatch = useDispatch();

  const name = useSelector(getAccountName);
  const email = useSelector(getAccountEmail);

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(accountActions.setAccountName(event.target.value));
  };

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(accountActions.setAccountEmail(event.target.value));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    alert(`Name: ${name}\nEmail: ${email}`);
  };

  return (
    <form className="AccountForm" onSubmit={onSubmit}>
      <label className="AccountForm__label">
        Name
        <input className="AccountForm__input" type="text" value={name} onChange={onNameChange} />
      </label>

      <label className="AccountForm__label">
        Email
        <input className="AccountForm__input" type="email" value={email} onChange={onEmailChange} />
      </label>

      <button type="submit" className="AccountForm__submitButton">Отправить</button>
    </form>
  );
};
