import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import { requestLogger } from '../middlewares/request.logger.middleware';
import routes from '../routes';
import { APP_ENV } from './environment';
import { requestIdMiddleware } from '../middlewares/request.id.middleware';
import {
  errorHandler,
  handleProcessErrors,
} from '../middlewares/error.handler.middleware';
import { setupSwagger } from './swagger';

/**
 * Express application instance.
 */
const app = express();

/**
 * Configures the Express application:
 * - Handles process errors.
 * - Enables CORS.
 * - Parses JSON requests.
 * - Adds request ID and logging middlewares.
 * - Registers application routes.
 * - Adds error handling middleware.
 * - Exposes a `/routes` endpoint in development to list all routes.
 * - Sets up Swagger documentation.
 */
function serverSetup(): void {
  // Handle uncaught exceptions and promise rejections
  handleProcessErrors();

  // Enable CORS
  app.use(cors());

  // Parse JSON requests
  app.use(express.json());

  // Add request ID middleware
  app.use(requestIdMiddleware);

  // Add request logging middleware
  app.use(requestLogger);

  // Register application routes
  app.use(routes);

  // Add error handling middleware
  app.use(errorHandler);

  // Expose a `/routes` endpoint in development to list all routes
  if (APP_ENV.NODE_ENV === 'dev') {
    app.get('/routes', (req, res) => {
      res.json(listEndpoints(app));
    });

    // Set up Swagger documentation
    setupSwagger(app);
  }
}

serverSetup();

/**
 * Exports the Express application instance.
 */
export { app };
