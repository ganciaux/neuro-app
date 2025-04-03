import { app } from './config/server';
import { prismaConnect } from './config/database';
import { APP_ENV } from './config/environment';
import { logger } from './logger/logger';

/**
 * Starts the server:
 * 1. Connects to the database.
 * 2. Sets up Express middleware.
 * 3. Listens on the specified port.
 *
 * @throws {Error} If the database connection fails or the server cannot start.
 */
async function serverStart(): Promise<void> {
  await prismaConnect("index.ts");

  app.listen(APP_ENV.PORT, () => {
    logger.info(`index: ${APP_ENV.NODE_ENV_LABEL}`);
    logger.info(`index: 🚀 Server is running on port ${APP_ENV.PORT}`);
  });
}

if (require.main === module) {
  serverStart();
}