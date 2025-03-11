export {};

import { UserTest } from '../models/user.model';

declare global {
  var user: UserTest;
  var admin: UserTest;
}
