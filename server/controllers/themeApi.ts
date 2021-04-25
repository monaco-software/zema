import { Express } from 'express';
import { ResLocals } from '@server/types';
import { API_PATH } from '@server/router/paths';
import { auth } from '@server/middlewares/auth';
import { UpdateThemeParams } from '@api/schema';
import { UserModel } from '@server/models/UserModel';
import { ThemeModel } from '@server/models/ThemeModel';

export const themeApi = (app: Express) => {
  app.put<any, any, UpdateThemeParams, any, ResLocals>(
    API_PATH.USER_THEME,
    auth,
    (req, res) => {
      (async () => {
        const userId = res.locals.user.id;
        const { themeId } = req.body;

        await UserModel.setUserTheme({ userId, themeId });
        res.status(200).json('Ok');
      })();
    }
  );

  app.get(`${API_PATH.USER_THEME}/:userId`, (req, res) => {
    (async () => {
      const userId = Number(req.params.userId);
      const themeId = await UserModel.getUserTheme({ userId });
      res.status(200).json({ themeId });
    })();
  });

  app.get(API_PATH.THEMES, (_req, res) => {
    (async () => {
      const themes = await ThemeModel.getThemes();
      res.status(200).json(themes);
    })();
  });
};
