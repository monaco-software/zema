import './sign-in.css';
import React, { FC, useState } from 'react';
import b_ from 'b_';
import { FormExtendedEvent, Heading, Main } from 'grommet';
import { getLang } from '../../common/langUtils';
import { SignInForm } from './Components/Form/SignInForm';
import { SignInFormFields } from './types';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../common/constants';
import { useAsyncAction, useAuth } from '../../hooks';
import { asyncAppActions } from '../../store/asyncActions';

const block = b_.lock('sign-in');

export const SignIn: FC = () => {
  useAuth(false);

  const signInUser = useAsyncAction(asyncAppActions.signInUser);

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const [formFields, setFormFields] = useState<SignInFormFields>({ login: '', password: '' });
  const onFieldsChange = (value: SignInFormFields) => setFormFields(value);
  const onSubmit = ({ value }: FormExtendedEvent<SignInFormFields>) => {
    if (Object.values(value).some((field) => field.trim() === '')) {
      return;
    }

    setIsLoading(true);
    signInUser(value)
      .then(() => {
        history.replace(ROUTES.ROOT);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
      });
  };

  const goToSignUp = () => history.push(ROUTES.SIGNUP);

  return (
    <div className={block()}>
      <Main justify="center" align="center" pad={{ vertical: 'xlarge' }}>
        <Heading>
          {getLang('signin_page_header')}
        </Heading>

        <SignInForm
          fields={formFields}
          onChange={onFieldsChange}
          onSubmit={onSubmit}
          goToSignUp={goToSignUp}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </Main>
    </div>
  );
};
