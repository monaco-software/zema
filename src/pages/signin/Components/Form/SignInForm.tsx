import './sign-in-form.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { getText } from '@common/langUtils';
import { SignInFormFields } from '../../types';
import { GROMMET_COLORS } from '@components/App/grommetTheme';
import { LoadingOverlay } from '@components/LoadingOverlay/LoadingOverlay';
import {
  Button,
  Form,
  FormField,
  Grid,
  TextInput,
  TypedForm,
  Anchor,
  FormExtendedEvent,
  Box,
  Text,
} from 'grommet';

const block = b_.lock('sign-in-form');

const TypedForm = Form as TypedForm<SignInFormFields>;

interface Props {
  fields: SignInFormFields;
  onChange: (value: SignInFormFields) => void;
  onSubmit: (event: FormExtendedEvent<SignInFormFields>) => void;
  goToSignUp: VoidFunction;
  isLoading: boolean;
  errorMessage?: string;
}

export const SignInForm: FC<Props> = ({
  fields,
  onChange,
  onSubmit,
  goToSignUp,
  isLoading,
  errorMessage,
}) => {
  return (
    <TypedForm
      className={block()}
      value={fields}
      onChange={onChange}
      onSubmit={onSubmit}
    >
      <LoadingOverlay isLoading={isLoading}>
        <FormField label={getText('form_login_label')} htmlFor="signin_login">
          <TextInput id="signin_login" name="login" autoFocus />
        </FormField>

        <FormField
          label={getText('form_password_label')}
          htmlFor="signin_password"
        >
          <TextInput id="signin_password" name="password" type="password" />
        </FormField>

        {errorMessage && (
          <Box pad={{ horizontal: 'small' }}>
            <Text color={GROMMET_COLORS.STATUS_ERROR}>{errorMessage}</Text>
          </Box>
        )}

        <Grid gap="small" margin={{ top: 'medium' }}>
          <Button
            primary
            type="submit"
            label={getText('signin_form_submit_button')}
          />
          <Anchor
            className={block('no-account-button')}
            onClick={goToSignUp}
            label={getText('signin_form_no_account_button')}
          />
        </Grid>
      </LoadingOverlay>
    </TypedForm>
  );
};
