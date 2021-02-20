import { SignInFormFields } from '../signin/types';

export interface SignUpFormFields extends SignInFormFields {
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
  password_confirm: string;
}
