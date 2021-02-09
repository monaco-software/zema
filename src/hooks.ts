import { useLayoutEffect } from 'react';
import { ActionCreatorWithPayload, bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { getIsSignedInd } from './store/selectors';
import { useHistory } from 'react-router-dom';
import { ROUTES } from './common/constants';

export const useAction = <P>(action: ActionCreatorWithPayload<P>) => {
  const dispatch = useDispatch();

  return bindActionCreators(action, dispatch);
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

    history.replace(ROUTES.SIGNIN);
  }, [isSignedIn, needAuth]);
};
