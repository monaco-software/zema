import { YANDEX_API_URL } from '../api/methods';
import { UserObject } from '../api/schema';

export const getAvatarFullPath = (path: string) => `${YANDEX_API_URL}${path}`;

export const getUserWithFullAvatarUrl = (user: UserObject): UserObject => {
  return {
    ...user,
    avatar: user.avatar && getAvatarFullPath(user.avatar),
  };
};
