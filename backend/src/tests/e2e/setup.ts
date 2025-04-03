import { app } from '../../config/server';
import { prisma, prismaConnect, prismaDisconnect } from '../../config/database';
import request from 'supertest';
import { logger } from '../../logger/logger';
import { APP_ENV } from '../../config/environment';

let server: import('http').Server;

beforeAll(async () => {
  await prismaConnect("e2e:setup.ts");
  server = app.listen(0, () => {
    logger.info(`setup: ${APP_ENV.NODE_ENV_LABEL}`);
    logger.info(`setup: 🚀 Server is running...`);
  });
  global.testRequest = request(server);
});

afterAll(async () => {
  server.close(()=>logger.info(`setup: 🚀 Server is closed...`));
  await prismaDisconnect("e2e:setup.ts");
});