import './sign-up-form.css';

import React, { FC } from 'react';
import b_ from 'b_';
import {
  Anchor,
  Box,
  Button,
  Form,
  FormExtendedEvent,
  FormField,
  Grid,
  MaskedInput, Text,
  TextInput,
  TypedForm,
} from 'grommet';
import { SignUpFormFields } from '../../types';
import { LoadingOverlay } from '@components/LoadingOverlay/LoadingOverlay';
import { getText } from '@common/langUtils';
import {
  emailValidate,
  loginValidate,
  nameValidate,
  passwordConfirmValidate,
  passwordValidate,
  phoneValidate,
} from '@common/validations';
import { phoneMask } from '@common/masks';
import { GROMMET_COLORS } from '@components/App/grommetTheme';

const TypedForm = Form as TypedForm<SignUpFormFields>;

const block = b_.lock('sign-up-form');

const messages = {
  required: getText('required_field'),
};

interface Props {
  fields: SignUpFormFields;
  onChange: (value: SignUpFormFields) => void;
  onSubmit: (event: FormExtendedEvent<SignUpFormFields>) => void;
  isLoading: boolean;
  goToSignIn: VoidFunction;
  errorMessage?: string;
}

export const SignUpForm: FC<Props> = ({
  fields,
  onChange,
  onSubmit,
  isLoading,
  goToSignIn,
  errorMessage,
}) => {
  return (
    <TypedForm
      className={block()}
      messages={messages}
      value={fields}
      onChange={onChange}
      onSubmit={onSubmit}
      validate="blur"
    >
      <LoadingOverlay isLoading={isLoading}>
        <FormField
          label={getText('form_email_label')}
          htmlFor="signup_email"
          name="email"
          required
          validate={emailValidate}
        >
          <TextInput id="signup_email" name="email" />
        </FormField>

        <FormField
          label={getText('form_login_label')}
          htmlFor="signup_login"
          name="login"
          required
          validate={loginValidate}
        >
          <TextInput id="signup_login" name="login" />
        </FormField>

        <FormField
          label={getText('form_first_name_label')}
          htmlFor="signup_first_name"
          name="first_name"
          required
          validate={nameValidate}
        >
          <TextInput id="signup_first_name" name="first_name" />
        </FormField>

        <FormField
          label={getText('form_second_name_label')}
          htmlFor="signup_second_name"
          name="second_name"
          required
          validate={nameValidate}
        >
          <TextInput id="signup_second_name" name="second_name" />
        </FormField>

        <FormField
          label={getText('form_phone_label')}
          htmlFor="signup_phone"
          name="phone"
          required
          validate={phoneValidate}
        >
          <MaskedInput id="signup_phone" name="phone" mask={phoneMask} />
        </FormField>

        <FormField
          label={getText('form_password_label')}
          htmlFor="signup_password"
          name="password"
          required
          validate={passwordValidate}
        >
          <TextInput id="signup_password" name="password" type="password" />
        </FormField>

        <FormField
          label={getText('form_password_confirm_label')}
          htmlFor="signup_password_confirm"
          name="password_confirm"
          required
          validate={passwordConfirmValidate}
        >
          <TextInput id="signup_password_confirm" name="password_confirm" type="password" />
        </FormField>

        {errorMessage && (
          <Box pad={{ horizontal: 'small' }}>
            <Text color={GROMMET_COLORS.STATUS_ERROR}>{errorMessage}</Text>
          </Box>
        )}

        <Grid gap="small" margin={{ top: 'medium' }}>
          <Button primary type="submit" label={getText('signup_form_submit_button')} />
          <Anchor
            className={block('no-account-button')}
            onClick={goToSignIn}
            label={getText('signup_form_no_account_button')}
          />
        </Grid>
      </LoadingOverlay>
    </TypedForm>
  );
};
