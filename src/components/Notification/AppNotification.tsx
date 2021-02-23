import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getAppNotification } from '../../store/selectors';
import { Notification } from './Notification';
import { useAction } from '../../hooks';
import { appActions } from '../../store/reducer';

export const AppNotification: FC = ({}) => {
  const timeoutRef = useRef<number>();

  const setNotification = useAction(appActions.setNotification);

  const notification = useSelector(getAppNotification);

  const onClose = () => {
    clearTimeout(timeoutRef.current);
    setNotification(undefined);
  };

  useEffect(() => {
    if (!notification) {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setNotification(undefined);
    }, 4000);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [notification]);

  if (!notification || notification.message === '') {
    return null;
  }

  return (
    <Notification
      {...notification}
      onClose={onClose}
    />
  );
};
