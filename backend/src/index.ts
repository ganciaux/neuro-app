import { app, setupExpress } from './config/server';
import { connectToDatabase } from './config/database';
import { APP_ENV } from './config/environment';
import { logger } from './logger/logger';
import { Server } from 'http';

/**
 * HTTP server instance.
 */
let server: Server;

/**
 * Starts the server:
 * 1. Connects to the database.
 * 2. Sets up Express middleware.
 * 3. Listens on the specified port.
 *
 * @throws {Error} If the database connection fails or the server cannot start.
 */
async function startServer(): Promise<void> {
  await connectToDatabase();
  setupExpress();

  server = app.listen(APP_ENV.PORT, () => {
    logger.info(`index: ${APP_ENV.NODE_ENV_LABEL}`);
    logger.info(`index: 🚀 Server is running on port ${APP_ENV.PORT}`);
  });
}

startServer();

/**
 * Exported instances:
 * - `app`: Express application.
 * - `server`: HTTP server.
 */
export { app, server };