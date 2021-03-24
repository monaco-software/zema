import { UserObject } from '@api/schema';
import { NotificationStatus } from '@components/Notification/Notification';

export type Voidable<T> = undefined extends T ? void : T;

interface Notification {
  status: NotificationStatus;
  message: string;
}

export interface AppState {
  user: UserObject;
  isSignedIn: boolean;
  notification: Notification | null;
  isSSR: boolean;
}
