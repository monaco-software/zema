import { AppThunk } from '@store/store';
import { appActions } from '@store/reducer';
import { NotificationStatus } from '@components/Notification/Notification';
import { isJsonString } from '@common/utils';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | string;

interface RequestOptions extends RequestInit {
  method: Methods;
}

export const createApiMethod = <TParams = undefined, TResponse = unknown>(path: string, options: RequestOptions) => {
  return (params: TParams, defaultErrorHandling = true): AppThunk<Promise<TResponse>> => {
    return (dispatch): Promise<TResponse> => {
      let preparedParams: BodyInit | null = null;

      if (params instanceof FormData || params instanceof Blob) {
        preparedParams = params;
      } else if (params !== null && params !== undefined) {
        preparedParams = JSON.stringify(params);
      }

      const preparedOptions = {
        ...options,
        body: preparedParams,
      };

      return fetch(path, preparedOptions)
        .then((response) => {
          // статус 200-299
          if (response.ok) {
            return response.json().catch((error) => {
              console.warn(error);
            });
          }
          if (response.statusText) {
            throw new Error(
              `${response.status}: ${response.statusText}`
            );
          }
          // если нет statusText вытаскиваем сообщение из тела
          return response.text().then((responseText) => {
            const hasReason = isJsonString(responseText) && JSON.parse(responseText).reason;
            const errorMessage = hasReason ?
              JSON.parse(responseText).reason :
              responseText;
            throw new Error(
              `${response.status}: ${errorMessage}`
            );
          });
        })
        .catch((error) => {
          if (defaultErrorHandling) {
            const errorString = typeof error === 'string'
              ? error
              : error.message || JSON.stringify(error);

            dispatch(appActions.setNotification({
              status: NotificationStatus.ERROR,
              message: errorString,
            }));
          }
          console.error(error);
          throw error;
        });
    };
  };
};
