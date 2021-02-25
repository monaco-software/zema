import './account-form.css';

import React, { FC } from 'react';
import b_ from 'b_';
import {
  Box,
  Button,
  Form,
  FormExtendedEvent,
  FormField,
  Grid,
  MaskedInput,
  Text,
  TextInput,
  TypedForm,
} from 'grommet';
import { AccountFormFields } from '../../types';
import { getText } from '../../../../common/langUtils';
import { emailValidate, nameValidate, phoneValidate } from '../../../../common/validations';
import { phoneMask } from '../../../../common/masks';
import { GROMMET_COLORS } from '../../../../components/App/grommetTheme';

const TypedForm = Form as TypedForm<AccountFormFields>;

const block = b_.lock('account-form');

const messages = {
  required: getText('required_field'),
};

interface Props {
  fields: AccountFormFields;
  onChange: (value: AccountFormFields) => void;
  onSubmit: (event: FormExtendedEvent<AccountFormFields>) => void;
  onReset: () => void;
  errorMessage?: string;
}

export const AccountForm: FC<Props> = ({
  fields,
  onChange,
  onSubmit,
  onReset,
  errorMessage,
}) => {
  return (
    <TypedForm
      className={block()}
      messages={messages}
      value={fields}
      onChange={onChange}
      onSubmit={onSubmit}
      onReset={onReset}
      validate="blur"
    >
      <FormField
        label={getText('form_email_label')}
        htmlFor="account_email"
        name="email"
        required
        validate={emailValidate}
      >
        <TextInput id="account_email" name="email" />
      </FormField>

      <FormField
        label={getText('form_first_name_label')}
        htmlFor="account_first_name"
        name="first_name"
        required
        validate={nameValidate}
      >
        <TextInput id="account_first_name" name="first_name" />
      </FormField>

      <FormField
        label={getText('form_second_name_label')}
        htmlFor="account_second_name"
        name="second_name"
        required
        validate={nameValidate}
      >
        <TextInput id="account_second_name" name="second_name" />
      </FormField>

      <FormField
        label={getText('account_form_display_name_label')}
        htmlFor="account_display_name"
        name="display_name"
        required
        validate={nameValidate}
      >
        <TextInput id="account_display_name" name="display_name" />
      </FormField>

      <FormField
        label={getText('form_phone_label')}
        htmlFor="account_phone"
        name="phone"
        required
        validate={phoneValidate}
      >
        <MaskedInput
          id="account_phone"
          name="phone"
          mask={phoneMask}
        />
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
          label={getText('account_form_submit_button')}
        />
        <Button
          primary
          type="reset"
          label={getText('account_form_reset_button')}
        />
      </Grid>
    </TypedForm>
  );
};
