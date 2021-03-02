import { getText } from './langUtils';
import { FormFieldProps } from 'grommet';

// eslint-disable-next-line max-len
export const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type FormFiledValidation = FormFieldProps['validate'];

export const emailValidate: FormFiledValidation = {
  regexp: EMAIL_REGEXP,
  message: getText('form_email_input_error'),
  status: 'error',
};

export const loginValidate: FormFiledValidation = {
  regexp: /^[a-z\d]{3,}$/i,
  message: getText('form_login_input_error'),
  status: 'error',
};

export const nameValidate: FormFiledValidation = {
  regexp: /^[a-zа-я]{3,}$/i,
  message: getText('form_second_name_error'),
  status: 'error',
};

export const phoneValidate: FormFiledValidation = {
  regexp: /^8 \([0-9]{1,3}\) [0-9]{1,3}-[0-9]{1,4}$/,
  message: getText('form_phone_input_error'),
  status: 'error',
};

export const passwordValidate: FormFiledValidation = [
  {
    regexp: /(?=.*?[A-Z])/,
    message: getText('form_password_min_uppercase'),
    status: 'error',
  },
  {
    regexp: /(?=.*?[a-z])/,
    message: getText('form_password_min_lowercase'),
    status: 'error',
  },
  {
    regexp: /(?=.*?[#?!@$ %^&*-])/,
    message: getText('form_password_min_special'),
    status: 'error',
  },
  {
    regexp: /.{8,}/,
    message: getText('form_password_min_chars'),
    status: 'error',
  },
];

export const passwordConfirmValidate: FormFiledValidation = [
  (value: string, fields: Record<string, any>) => {
    const compareField = fields.password || fields.newPassword;
    if (value !== compareField) {
      return getText('form_password_equal_confirm');
    }
    return undefined;
  },
];
