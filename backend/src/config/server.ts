import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import { requestLogger } from '../middlewares/request.logger.middleware';
import routes from '../routes';
import { APP_ENV } from './environment';
import { requestIdMiddleware } from '../middlewares/request.id.middleware';

const app = express();

export function setupExpress() {
  app.use(cors());
  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use(requestLogger);
  app.use(routes);

  if (APP_ENV.NODE_ENV === "dev") {
    app.get('/routes', (req, res) => {
      res.json(listEndpoints(app));
    });
  }
}

export { app };
