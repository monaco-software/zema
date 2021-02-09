import { SignInParams, UserObject } from './schema';

const YANDEX_API_URL = 'https://ya-praktikum.tech/api/v2';
const getFullPath = (path: string) => `${YANDEX_API_URL}${path}`;

// TODO: написать общую обертку для хождения в АПИ и обработки ошибок
export const apiGetUser = (): Promise<UserObject> => {
  return fetch(getFullPath('/auth/user'), {
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.reason) {
        throw new Error(responseData.reason);
      }
      return responseData;
    });
};

export const apiPerformSignIn = (params: SignInParams): Promise<string> => {
  return fetch(getFullPath('/auth/signin'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then((response) => {
      return response.json()
        .catch(() => undefined);
    })
    .then((responseData) => {
      if (responseData?.reason) {
        throw new Error(responseData.reason);
      }
      return responseData;
    });
};
