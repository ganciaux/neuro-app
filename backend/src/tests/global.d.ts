export {};

import { UserAuth } from '../models/user.model'

declare global {
  var user: {
    email: string;
    password: string;
    auth:UserAuth;
  },
  var admin: {
    email: string;
    password: string;
    auth:UserAuth;
  }
}
