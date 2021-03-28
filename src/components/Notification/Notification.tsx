import './notification.css';
import b_ from 'b_';
import React, { FC, ReactNode } from 'react';
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
  onClose: VoidFunction;
}

export const Notification: FC<Props> = ({
  notification: { status = NotificationStatus.INFO, message },
  onClose,
}) => {
  const closeIcon = <FormClose />;

  return (
    <Layer
      modal={false}
      responsive={false}
      position="bottom-right"
      background={{ color: '#0000' }}
    >
      <div className={block({ status: status })}>
        <div className={block('body')}>
          <StatusIcon status={status} />

          <div className={block('message')}>{message}</div>

          <Button
            icon={closeIcon}
            onClick={onClose}
            plain
            margin={{ left: 'auto' }}
          />
        </div>
      </div>
    </Layer>
  );
};
