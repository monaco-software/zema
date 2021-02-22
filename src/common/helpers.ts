import { YANDEX_API_URL } from '../api/methods';
import { UserObject } from '../api/schema';

export const getAvatarFullPath = (path: string) => `${YANDEX_API_URL}${path}`;

export const getUserWithFullAvatarUrl = (user: UserObject): UserObject => {
  return {
    ...user,
    avatar: user.avatar && getAvatarFullPath(user.avatar),
  };
};

export const getUserFullName = ({ display_name, first_name, second_name }: UserObject) => {
  if (display_name) {
    return display_name;
  }

  return `${first_name} ${second_name}`;
};
