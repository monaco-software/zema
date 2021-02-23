import { UserObject } from '../api/schema';
import { NotificationStatus } from '../components/Notification/Notification';
import { ReactNode } from 'react';

export interface AppState {
  user: UserObject;
  isSignedIn: boolean;
  notification?: {
    status: NotificationStatus;
    message: ReactNode;
  };
}
