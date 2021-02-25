import { UpdatePasswordParams, UpdateProfileParams } from '../../api/schema';

export type AccountFormFields = UpdateProfileParams;

export interface AvatarFormFields {
  avatarFileInput: File;
}

export interface PasswordFormFields extends UpdatePasswordParams {
  confirmPassword: string;
}
