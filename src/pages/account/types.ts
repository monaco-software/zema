import { UpdatePasswordParams, UpdateProfileParams } from '@api/schema';

export type AccountFormFields = UpdateProfileParams;

export interface AvatarFormFields {
  avatarFileInput: File | null;
}

export interface PasswordFormFields extends UpdatePasswordParams {
  confirmPassword: string;
}
