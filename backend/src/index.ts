import { app, setupExpress } from './config/server';
import { connectToDatabase } from './config/database';
import { APP_ENV } from './config/environment';
import { logger } from './logger/logger';
import { Server } from 'http';

let server: Server;

async function startServer() {
  await connectToDatabase();
  setupExpress();

  server = app.listen(APP_ENV.PORT, () => {
    logger.info(`index: ${APP_ENV.NODE_ENV_LABEL}`);
    logger.info(`index: 🚀 Server is running on port ${APP_ENV.PORT}`);
  });
}

startServer();

export { app, server };
