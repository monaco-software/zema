import setCookie from 'set-cookie-parser';
import { Request, Response } from 'express';
import { Response as FetchResponse } from 'node-fetch';

export const getCookies = (
  req: Request
): { cookie: string } | Record<string, never> => {
  const { cookie } = req.headers;

  if (cookie) {
    return {
      cookie,
    };
  }

  return {};
};

export const getCookiesFromApiResponse = (apiResponse: FetchResponse) => {
  const cookies = setCookie.parse(apiResponse.headers.raw()['set-cookie'], {
    decodeValues: true,
  });

  const cookiesSet = new Set<string>();

  const cookieString = cookies
    .reduceRight((acc: string[], { name, value }) => {
      if (!cookiesSet.has(name)) {
        acc.push(`${name}=${value}`);
        cookiesSet.add(name);
      }

      return acc;
    }, [])
    .join('; ');

  return {
    cookie: cookieString,
  };
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
  console.error(error);
  const errorString =
    typeof error === 'string' ? error : error.message || JSON.stringify(error);
  res.status(error.status ?? 400).send(errorString);
};
