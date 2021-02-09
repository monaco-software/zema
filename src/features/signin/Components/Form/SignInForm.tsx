import './sign-in-form.css';
import React, { FC } from 'react';
import b_ from 'b_';
import { Button, Form, FormField, Grid, TextInput, TypedForm, Anchor, FormExtendedEvent } from 'grommet';
import { getLang } from '../../../../common/langUtils';
import { SignInFormFields } from '../../types';

const block = b_.lock('sign-in-form');

const TypedForm = Form as TypedForm<SignInFormFields>;

interface Props {
  fields: SignInFormFields;
  onChange: (value: SignInFormFields) => void;
  onSubmit: (event: FormExtendedEvent<SignInFormFields>) => void;
  goToSignUp: VoidFunction;
}

export const SignInForm: FC<Props> = ({ fields, onChange, onSubmit, goToSignUp }) => {
  return (
    <TypedForm
      className={block()}
      value={fields}
      onChange={onChange}
      onSubmit={onSubmit}
    >
      <FormField label={getLang('signin_form_login_label')} htmlFor="signin_login">
        <TextInput id="signin_login" name="login" autoFocus />
      </FormField>

      <FormField label={getLang('signin_form_password_label')} htmlFor="signin_password">
        <TextInput id="signin_password" name="password" type="password" />
      </FormField>

      <Grid gap="small" margin={{ top: 'medium' }}>
        <Button primary type="submit" label={getLang('signin_form_submit_button')} />
        <Anchor className={block('no-account-button')} onClick={goToSignUp} label={getLang('signin_form_no_account_button')} />
      </Grid>
    </TypedForm>
  );
};
