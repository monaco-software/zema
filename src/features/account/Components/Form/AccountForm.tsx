import './account-form.css';
import React, { ChangeEvent, FC, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountEmail, getAccountName } from '../../selectors';
import { accountActions } from '../../reducer';
import b_ from 'b_';

const block = b_.lock('account-form');

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
    <form className={block()} onSubmit={onSubmit}>
      <label className={block('label')}>
        Name
        <input className={block('input')} type="text" value={name} onChange={onNameChange} />
      </label>

      <label className={block('label')}>
        Email
        <input className={block('input')} type="email" value={email} onChange={onEmailChange} />
      </label>

      <button type="submit" className={block('submit-button')}>Отправить</button>
    </form>
  );
};
