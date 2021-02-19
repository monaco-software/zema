import { YANDEX_API_URL } from '../api/methods';
import { UserObject } from '../api/schema';

export const getAvatarFullPath = (path: string) => `${YANDEX_API_URL}${path}`;

export const getUserWithFullAvatarUrl = (user: UserObject): UserObject => {
  return {
    ...user,
    avatar: user.avatar && getAvatarFullPath(user.avatar),
  };
};

export const getUserFullName = (user: UserObject) => {
  if (user.display_name) {
    return user.display_name;
  }

  return `${user.first_name} ${user.second_name}`;
};
