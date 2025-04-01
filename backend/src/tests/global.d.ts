export {};

import { UserTestData } from '../models/user.model';

declare global {
  var user: UserTestData;
  var admin: UserTestData;
}
