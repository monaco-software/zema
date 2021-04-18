import { prisma } from '@server/server';
import { Theme } from '@prisma/client';

export const ThemeModel = {
  async getThemes(): Promise<Theme[]> {
    return await prisma.theme.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  },
};
