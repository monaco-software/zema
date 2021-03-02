import { useLayoutEffect } from 'react';
import { ActionCreatorWithoutPayload, ActionCreatorWithPayload, bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { getIsSignedInd } from '@store/selectors';
import { useHistory } from 'react-router-dom';
import { ROUTES } from './constants';
import { AppThunk, Dispatch } from '@store/store';

export const useAction =
  <P>(action: undefined extends P ? ActionCreatorWithoutPayload : ActionCreatorWithPayload<P>) => {
    const dispatch = useDispatch();

    return bindActionCreators(action, dispatch);
  };

export const useAsyncAction = <TParams, TResponse>(action: (params: TParams) => AppThunk<TResponse>) => {
  const dispatch = useDispatch<Dispatch>();

  return (params: TParams) => dispatch(action(params));
};

export const useAuth = (needAuth = true) => {
  const history = useHistory();
  const isSignedIn = useSelector(getIsSignedInd);

  // useLayoutEffect чтобы не мигал контент компонента, в котором используется useNeedAuth
  useLayoutEffect(() => {
    if (isSignedIn && needAuth) {
      return;
    }

    if (isSignedIn && !needAuth) {
      history.replace(ROUTES.ROOT);
      return;
    }

    if (!isSignedIn && !needAuth) {
      return;
    }

    history.replace(ROUTES.SIGNIN);
  }, [isSignedIn, needAuth]);
};
