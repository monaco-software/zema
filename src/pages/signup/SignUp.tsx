import './sign-up.css';
import b_ from 'b_';
import React, { FC, useState } from 'react';
import { ROUTES } from '@common/constants';
import { SignUpFormFields } from './types';
import { getText } from '@common/langUtils';
import { useHistory } from 'react-router-dom';
import { asyncAppActions } from '@store/asyncActions';
import { useAsyncAction, useAuth } from '@common/hooks';
import { SignUpForm } from './Components/Form/SignUpForm';
import { FormExtendedEvent, Heading, Main } from 'grommet';

const block = b_.lock('sign-up');

export const SignUp: FC = () => {
  useAuth(false);

  const signUpUser = useAsyncAction(asyncAppActions.signUpUser);

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const [formFields, setFormFields] = useState<SignUpFormFields>({
    login: '',
    password: '',
    email: '',
    first_name: '',
    second_name: '',
    password_confirm: '',
    phone: '',
  });
  const onFieldsChange = (value: SignUpFormFields) => setFormFields(value);
  const onFormSubmit = ({ value }: FormExtendedEvent<SignUpFormFields>) => {
    setIsLoading(true);
    signUpUser(value)
      .then(() => {
        history.replace(ROUTES.ROOT);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
      });
  };

  const goToSignIn = () => history.push(ROUTES.SIGNIN);

  return (
    <div className={block()}>
      <Main justify="center" align="center" pad={{ vertical: 'xlarge' }}>
        <Heading>{getText('signup_page_header')}</Heading>

        <SignUpForm
          fields={formFields}
          onChange={onFieldsChange}
          onSubmit={onFormSubmit}
          isLoading={isLoading}
          goToSignIn={goToSignIn}
          errorMessage={errorMessage}
        />
      </Main>
    </div>
  );
};
