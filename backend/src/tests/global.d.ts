export {};

import request from 'supertest';

declare global {
  var testRequest: request.SuperTest<request.Test>;
}
