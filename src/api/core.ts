import { AppThunk } from '../store/store';
import { appActions } from '../store/reducer';
import { NotificationStatus } from '../components/Notification/Notification';

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
          if (response.ok) {
            return response.json();
          }
          if (response.statusText) {
            throw new Error(
              `Server returns status code ${response.status}: ${response.statusText}`
            );
          }
          return response.text().then((responseText) => {
            throw new Error(
              `Server returns status code ${response.status}: ${responseText}`
            );
          });
        })
        .then((responseData) => {
          if (responseData?.reason) {
            throw new Error(responseData.reason);
          }
          return responseData;
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
          console.warn(error);
          throw error;
        });
    };
  };
};
