import { LEADERBOARD_VALUE_FIELD_NAME } from '@pages/leaderboard/constants';

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

export type SignOutResponse = string;

export interface SignUpParams extends SignInParams{
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
}

export interface SignUpResponse {
  id: number;
}

export interface LeaderboardRecordObject {
  // Ключевое поле с кол-вом набранных пользователем очков
  [LEADERBOARD_VALUE_FIELD_NAME]: number;
  user_id: number;
  // Unix timestamp
  timestamp: number;
}

export interface UpdateLeaderboardParams {
  data: LeaderboardRecordObject;
  ratingFieldName: typeof LEADERBOARD_VALUE_FIELD_NAME;
}

export type UpdateLeaderboardResponse = string;

export interface GetLeaderboardParams {
  ratingFieldName: typeof LEADERBOARD_VALUE_FIELD_NAME;
  cursor: number;
  limit: number;
}

export type GetLeaderboardResponse = Array<{
  data: LeaderboardRecordObject;
}>;

export type UpdateProfileParams = NonNullable<Omit<UserObject, 'id' | 'avatar'>>;

export type UpdateProfileResponse = string;

export type UpdateAvatarParams = FormData;

export type UpdateAvatarResponse = string;

export interface UpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export type UpdatePasswordResponse = string;
