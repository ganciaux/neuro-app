import { app } from '../../config/server';
import { prisma, prismaConnect, prismaDisconnect } from '../../config/database';
import request from 'supertest';
import { logger } from '../../logger/logger';
import { APP_ENV } from '../../config/environment';

let server: import('http').Server;

beforeAll(async () => {
  await prismaConnect();
  server = app.listen(0, () => {
    logger.info(`e2e:setup: ${APP_ENV.NODE_ENV_LABEL}`);
    logger.info(`e2e:setup: 🚀 Server is running...`);
  });
  global.testRequest = request(server);
});

afterAll(async () => {
  server.close(()=>logger.info(`e2e:setup: 🚀 Server is closed...`));
  await prismaDisconnect();
});