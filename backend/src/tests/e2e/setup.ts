import { app } from '../../config/server';
import { prismaConnect, prismaDisconnect } from '../../config/database';
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
  await new Promise<void>((resolve) =>
    server.close(() => {
      logger.info(`e2e:setup: 🛑 Server is closed...`);
      resolve();
    }),
  );
  await prismaDisconnect();

  await cleanNodeJsResources();
});

const cleanNodeJsResources = async () => {
  logger.info(`e2e:setup: 🧹 Cleaning Node.js resources...`);
  ['http', 'https'].forEach((module) => {
    const agent = require(module).globalAgent;
    agent.destroy();
    agent.sockets = {};
    agent.requests = {};
  });

  jest.useFakeTimers();
  jest.clearAllTimers();

  if (global.gc) global.gc();
};
