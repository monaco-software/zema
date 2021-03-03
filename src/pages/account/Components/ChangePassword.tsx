import './change-password.css';

import { FormClose } from 'grommet-icons';
import React, { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormExtendedEvent,
  FormField,
  Grommet,
  Layer,
  TextInput,
  TypedForm,
} from 'grommet';
import b_ from 'b_';

import { grommetTheme } from '../../../components/App/grommetTheme';
import { PasswordFormFields } from '../types';
import { getText } from '../../../common/langUtils';
import { passwordConfirmValidate, passwordValidate } from '../../../common/validations';

const TypedForm = Form as TypedForm<PasswordFormFields>;

const block = b_.lock('change-password');

const messages = {
  required: getText('required_field'),
};

interface Props {
  fields: PasswordFormFields;
  onSubmit: (event: FormExtendedEvent<PasswordFormFields>) => void;
  onChange: (value: PasswordFormFields) => void;
  closeModal: () => void;
}

export const ChangePassword: FC<Props> = ({
  fields,
  onSubmit,
  onChange,
  closeModal,
}) => {
  return (
    <Layer
      modal={true}
      position="center"
      background={{ color: '#0000' }}
      onEsc={closeModal}
    >
      {/* в Grommet необходимо завернуть снова, без него в Layer не видно тему */}
      <Grommet background={{ color: '#0000' }} theme={grommetTheme} cssVars>
        <Card
          width="medium"
          background={{ color: 'white' }}
          className={block()}
        >
          <CardHeader className={block('header')} gap="none">
            <span className={block('header-status')}>
              <FormClose
                className={block('form-close')}
                color="white"
                onClick={closeModal}
              />
            </span>
            <span className={block('header-level')}>
              {getText('change_password_modal_header')}
            </span>
          </CardHeader>
          <CardBody className={block()}>
            <TypedForm
              messages={messages}
              value={fields}
              onSubmit={onSubmit}
              onChange={onChange}
              validate="blur"
            >
              <Box pad={{ horizontal: 'medium', top: 'small', bottom: 'medium' }}>
                <FormField
                  label={getText('form_old_password_label')}
                  htmlFor="change_password_old_password"
                  name="oldPassword"
                  required
                >
                  <TextInput id="change_password_old_password" name="oldPassword" type="password" />
                </FormField>
                <FormField
                  label={getText('form_new_password_label')}
                  htmlFor="change_password_password"
                  name="newPassword"
                  required
                  validate={passwordValidate}
                >
                  <TextInput id="change_password_password" name="newPassword" type="password" />
                </FormField>
                <FormField
                  label={getText('form_new_password_again_label')}
                  htmlFor="change_password_confirm_password"
                  name="confirmPassword"
                  required
                  validate={passwordConfirmValidate}
                >
                  <TextInput id="change_password_confirm_password" name="confirmPassword" type="password" />
                </FormField>

                <Button
                  margin={{ top: 'medium' }}
                  primary
                  type="submit"
                  label={getText('account_form_submit_button')}
                />
              </Box>
            </TypedForm>
          </CardBody>
        </Card>
      </Grommet>
    </Layer>
  );
};
