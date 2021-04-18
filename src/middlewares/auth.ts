import fetch from 'node-fetch';
import { HTTP_METHODS } from '@api/core';
import { API_PATH, getFullPath } from '@api/paths';
import { getCookies, handleApiError } from './helpers';
import { NextFunction, Response, Request } from 'express';

export const auth = (
  req: Request<any, any, any, any, any>,
  res: Response<any, any>,
  next: NextFunction
) => {
  fetch(getFullPath(API_PATH.AUTH_USER), {
    method: HTTP_METHODS.GET,
    headers: {
      ...getCookies(req),
    },
  })
    .then(async (apiResponse) => {
      if (apiResponse.ok) {
        res.locals.user = await apiResponse.json();
        next();
      } else {
        res.status(401).send();
      }
    })
    .catch((error) => handleApiError(error, res));
};
