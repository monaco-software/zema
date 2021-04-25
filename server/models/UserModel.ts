import { User } from '@prisma/client';
import { prisma } from '@server/server';

interface GetUserThemeParams {
  userId: number;
}

interface SetUserThemeParams {
  userId: number;
  themeId: number;
}

export const UserModel = {
  async getUserTheme({ userId }: GetUserThemeParams): Promise<number> {
    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
        },
      });
    }
    return user.themeId;
  },

  async setUserTheme({ userId, themeId }: SetUserThemeParams): Promise<User> {
    return await prisma.user.upsert({
      where: {
        id: userId,
      },
      update: {
        themeId,
      },
      create: {
        id: userId,
        themeId,
      },
    });
  },
};
