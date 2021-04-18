import { Express } from 'express';
import { ResLocals } from '@server/types';
import { API_PATH } from '@server/router/paths';
import { auth } from '@server/middlewares/auth';
import { UpdateThemeParams } from '@api/schema';
import { UserModel } from '@server/models/UserModel';

export const userApi = (app: Express) => {
  app.put<any, any, UpdateThemeParams, any, ResLocals>(
    API_PATH.USER_THEME,
    auth,
    (req, res) => {
      (async () => {
        const userId = res.locals.user.id;
        const { themeId } = req.body;

        await UserModel.setUserTheme({ userId, themeId });
        res.sendStatus(200);
      })();
    }
  );
};
