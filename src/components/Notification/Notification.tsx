import './notification.css';
import React, { FC, ReactNode } from 'react';
import b_ from 'b_';
import { Button, Layer } from 'grommet';
import { Alert, FormClose, StatusGood, StatusInfo } from 'grommet-icons';

const block = b_.lock('notification');

export enum NotificationStatus {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface StatusIconProps {
  status: NotificationStatus;
}

const StatusIcon: FC<StatusIconProps> = ({ status }) => {
  const size = '20px';

  switch (status) {
    case NotificationStatus.INFO:
      return <StatusInfo size={size} />;
    case NotificationStatus.SUCCESS:
      return <StatusGood size={size} />;
    case NotificationStatus.ERROR:
      return <Alert size={size} />;
    default:
      return null;
  }
};

interface Props {
  notification: {
    status?: NotificationStatus;
    message: ReactNode;
  };
  onClose?: VoidFunction;
}

export const Notification: FC<Props> = ({
  notification: {
    status = NotificationStatus.INFO,
    message,
  },
  onClose,
}) => {
  const closeIcon = <FormClose />;

  return (
    <Layer
      className={block({ 'status': status })}
      modal={false}
      responsive={false}
      position="bottom-right"
    >
      <div
        className={block('body')}
      >
        <StatusIcon status={status} />

        <div className={block('message')}>
          {message}
        </div>

        {onClose && (
          <Button
            icon={closeIcon}
            onClick={onClose}
            plain
            margin={{ left: 'auto' }}
          />
        )}
      </div>
    </Layer>
  );
};

