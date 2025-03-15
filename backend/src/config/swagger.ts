import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { APP_ENV } from './environment';

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
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(
    `📄 Swagger available at http://localhost:${APP_ENV.PORT}/api-docs`,
  );
}
