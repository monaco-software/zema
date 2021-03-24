import setCookie from 'set-cookie-parser';
import { Request, Response } from 'express';
import { Response as FetchResponse } from 'node-fetch';

export const getCookies = (req: Request): { cookie: string } | Record<string, never> => {
  if (req.headers.cookie) {
    return {
      cookie: req.headers.cookie,
    };
  }

  return {};
};

export const setCookies = (apiResponse: FetchResponse, res: Response) => {
  const cookies = setCookie.parse(apiResponse.headers.raw()['set-cookie'], {
    decodeValues: true,
  });

  cookies.forEach(({ name, value }) => {
    res.cookie(name, value, { secure: true, httpOnly: true });
  });
};

export const handleApiError = (error: any, res: Response) => {
  console.log('error');
  console.log(error.status);
  const errorString = typeof error === 'string'
    ? error
    : error.message || JSON.stringify(error);
  res
    .status(error.status ?? 400)
    .send(errorString);
};
