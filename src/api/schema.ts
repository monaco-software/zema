export interface UserObject {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string | null;
  login: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export interface SignInParams {
  login: string;
  password: string;
}

export type SignInResponse = string;

export interface SignUpParams extends SignInParams{
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
}

export interface SignUpResponse {
  id: number;
}
