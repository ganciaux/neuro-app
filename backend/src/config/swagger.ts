import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { APP_ENV } from './environment';
import { logger } from '../logger/logger';

/**
 * Swagger configuration options.
 */
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Neuro-App API',
      version: '1.0.0',
      description: 'Neuro-App API documentation',
    },
    servers: [
      {
        url: `http://localhost:${APP_ENV.PORT}`,
        description: `${APP_ENV.NODE_ENV_LABEL} server`,
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'], // Include files containing routes
};

/**
 * Generated OpenAPI specification based on the Swagger options.
 */
const swaggerSpec = swaggerJSDoc(options);

/**
 * Sets up Swagger documentation in the Express application.
 * @param app - The Express application instance.
 */
export function setupSwagger(app: Express): void {
  const swaggerPath = '/api-docs';
  const swaggerUrl = `http://localhost:${APP_ENV.PORT}${swaggerPath}`;

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info(
    `📄 Swagger available at ${swaggerUrl}`,
    `Swagger UI initialized`,
    {
      environment: APP_ENV.NODE_ENV_LABEL,
      endpoint: swaggerPath,
      url: swaggerUrl,
      status: 'available'
    }
  );
}
