import { ActionCreatorWithPayload, bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

export const useAction = <P>(action: ActionCreatorWithPayload<P>) => {
  const dispatch = useDispatch();

  return bindActionCreators(action, dispatch);
};
