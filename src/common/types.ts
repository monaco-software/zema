import { UserObject } from '../api/schema';

export interface AppState {
  user: UserObject;
  isSignedIn: boolean;
  error?: string;
}
