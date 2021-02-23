import { UserObject } from '../api/schema';
import { NotificationStatus } from '../components/Notification/Notification';
import { ReactNode } from 'react';

interface Notification {
  status: NotificationStatus;
  message: ReactNode;
}

export interface AppState {
  user: UserObject;
  isSignedIn: boolean;
  notification: Notification | null;
}
