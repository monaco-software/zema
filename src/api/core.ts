import { AppThunk } from '../store/store';
import { appActions } from '../store/reducer';

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
        .catch((error) => {
          defaultErrorHandling && dispatch(appActions.setError(JSON.stringify(error)));
          console.error(error);
          throw error;
        })
        .then((response) => {
          return response.json()
            .catch(() => undefined);
        })
        .then((responseData) => {
          if (responseData?.reason) {
            defaultErrorHandling && dispatch(appActions.setError(responseData.reason));
            console.error(responseData.reason);
            throw new Error(responseData.reason);
          }
          return responseData;
        });
    };
  };
};
