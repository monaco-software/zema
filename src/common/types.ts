import { UserObject } from '@api/schema';
import { NotificationStatus } from '@components/Notification/Notification';

interface Notification {
  status: NotificationStatus;
  message: string;
}

export interface AppState {
  user: UserObject;
  isSignedIn: boolean;
  notification: Notification | null;
}
