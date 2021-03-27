import { UserObject } from '@api/schema';
import { YANDEX_API_DOMAIN } from '@api/paths';

export const getAvatarFullPath = (path: string) => `${YANDEX_API_DOMAIN}${path}`;

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
