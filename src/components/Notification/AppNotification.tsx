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
    setNotification(null);
  };

  useEffect(() => {
    if (!notification) {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setNotification(null);
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
      notification={notification}
      onClose={onClose}
    />
  );
};
