import { UserObject } from '../../api/schema';

export interface UserObjectWithPoints extends UserObject {
  points: number;
}
