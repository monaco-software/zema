import { Theme } from '@prisma/client';
import { prisma } from '@server/server';

export const ThemeModel = {
  async getThemes(): Promise<Theme[]> {
    return await prisma.theme.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  },
};
