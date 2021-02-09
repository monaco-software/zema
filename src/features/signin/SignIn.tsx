import './sign-in.css';
import React, { FC, useState } from 'react';
import b_ from 'b_';
import { FormExtendedEvent, Heading, Main } from 'grommet';
import { getLang } from '../../common/langUtils';
import { SignInForm } from './Components/Form/SignInForm';
import { SignInFormFields } from './types';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../common/constants';

const block = b_.lock('sign-in');

export const SignIn: FC = () => {
  const history = useHistory();

  const [formFields, setFormFields] = useState<SignInFormFields>({ login: '', password: '' });
  const onFieldsChange = (value: SignInFormFields) => setFormFields(value);
  const onSubmit = ({ value }: FormExtendedEvent<SignInFormFields>) => {
    console.log(value);
    // TODO: запрос в апи
  };

  const goToSignUp = () => history.push(ROUTES.SIGNUP);

  return (
    <div className={block()}>
      <Main justify="center" align="center">
        <Heading>
          {getLang('signin_page_header')}
        </Heading>

        <SignInForm
          fields={formFields}
          onChange={onFieldsChange}
          onSubmit={onSubmit}
          goToSignUp={goToSignUp}
        />
      </Main>
    </div>
  );
};
