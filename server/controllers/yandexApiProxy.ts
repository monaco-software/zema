import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import express, { Express } from 'express';
import { AVATAR_FIELD_NAME } from '@common/constants';
import { getCookies, handleApiError, setCookies } from '@server/lib/cookies';
import { API_PATH, getFullPathFromProxy, getProxyPath } from '../router/paths';

const jsonParser = express.json();
const upload = multer();

const authProxy = (app: Express) => {
  app.get(getProxyPath(API_PATH.AUTH_USER), (req, res) => {
    fetch(getFullPathFromProxy(req.url), {
      method: req.method,
      headers: {
        ...getCookies(req),
      },
    })
      .then(async (apiResponse) => {
        res.status(apiResponse.status).send(await apiResponse.json());
      })
      .catch((error) => handleApiError(error, res));
  });

  app.post(
    [getProxyPath(API_PATH.AUTH_SIGNIN), getProxyPath(API_PATH.AUTH_SIGNUP)],
    jsonParser,
    (req, res) => {
      fetch(getFullPathFromProxy(req.url), {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      })
        .then(async (apiResponse) => {
          setCookies(apiResponse, res);

          res.status(apiResponse.status).send(await apiResponse.text());
        })
        .catch((error) => handleApiError(error, res));
    }
  );

  app.post(getProxyPath(API_PATH.AUTH_LOGOUT), (req, res) => {
    fetch(getFullPathFromProxy(req.url), {
      method: req.method,
      headers: {
        ...getCookies(req),
      },
    })
      .then(async (apiResponse) => {
        res
          .clearCookie('uuid')
          .clearCookie('authCookie')
          .status(apiResponse.status)
          .send(await apiResponse.text());
      })
      .catch((error) => handleApiError(error, res));
  });
};

const userProxy = (app: Express) => {
  app.put(
    [getProxyPath(API_PATH.USER_PROFILE), getProxyPath(API_PATH.USER_PASSWORD)],
    jsonParser,
    (req, res) => {
      fetch(getFullPathFromProxy(req.url), {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...getCookies(req),
        },
        body: JSON.stringify(req.body),
      })
        .then(async (apiResponse) => {
          res.status(apiResponse.status).send(await apiResponse.text());
        })
        .catch((error) => handleApiError(error, res));
    }
  );

  app.get(`${getProxyPath(API_PATH.USER_BY_ID)}/*`, (req, res) => {
    fetch(getFullPathFromProxy(req.url), {
      method: req.method,
      headers: {
        ...getCookies(req),
      },
    })
      .then(async (apiResponse) => {
        res.status(apiResponse.status).send(await apiResponse.json());
      })
      .catch((error) => handleApiError(error, res));
  });

  app.put(
    getProxyPath(API_PATH.USER_PROFILE_AVATAR),
    upload.single(AVATAR_FIELD_NAME),
    (req, res) => {
      const { buffer, originalname } = req.file;

      const formData = new FormData();
      formData.append(AVATAR_FIELD_NAME, buffer, {
        filename: encodeURIComponent(originalname),
      });

      fetch(getFullPathFromProxy(req.url), {
        method: req.method,
        headers: {
          ...getCookies(req),
        },
        body: formData,
      })
        .then(async (apiResponse) => {
          res.status(apiResponse.status).send(await apiResponse.text());
        })
        .catch((error) => handleApiError(error, res));
    }
  );

  app.get(`${getProxyPath(API_PATH.USER_AVATAR_SRC)}/*`, (req, res) => {
    fetch(getFullPathFromProxy(req.url), {
      method: req.method,
      headers: {
        ...getCookies(req),
      },
    }).then((response) => {
      res.set({
        'content-length': response.headers.get('content-length'),
        'content-type': response.headers.get('content-type'),
      });
      response.body.on('error', (e) => {
        console.error(e);
      });
      response.body.pipe(res);
    });
  });
};

const leaderboardProxy = (app: Express) => {
  app.post(getProxyPath(API_PATH.LEADERBOARD_ALL), jsonParser, (req, res) => {
    fetch(getFullPathFromProxy(req.url), {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...getCookies(req),
      },
      body: JSON.stringify(req.body),
    })
      .then(async (apiResponse) => {
        res.status(apiResponse.status).send(await apiResponse.json());
      })
      .catch((error) => handleApiError(error, res));
  });

  app.post(
    getProxyPath(API_PATH.LEADERBOARD_UPDATE),
    jsonParser,
    (req, res) => {
      fetch(getFullPathFromProxy(req.url), {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...getCookies(req),
        },
        body: JSON.stringify(req.body),
      })
        .then(async (apiResponse) => {
          res.status(apiResponse.status).send(await apiResponse.text());
        })
        .catch((error) => handleApiError(error, res));
    }
  );
};

export const yandexApiProxy = (app: Express) => {
  authProxy(app);
  userProxy(app);
  leaderboardProxy(app);
};
