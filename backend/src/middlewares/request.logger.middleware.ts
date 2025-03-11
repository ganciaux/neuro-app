import { Request, Response, NextFunction } from 'express';
import { format } from 'date-fns';
import { logger } from '../logger/logger';

export function requestLogger(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const start = Date.now();

  response.on('finish', () => {
    try {
      const duration = Date.now() - start;
      const requestId = request.requestId || '<none>';
      logger.info(`Request [${requestId}]: duration=${duration}ms`);
      logger.info(`Request [${requestId}]: statusCode=${response.statusCode}`);
      logger.info(
        `Request [${requestId}]: headers=${JSON.stringify(maskSensitiveHeaders(request.headers))}`,
      );
      logger.info(
        `Request [${requestId}]: body=${JSON.stringify(maskSensitiveData(request.body))}`,
      );
      logger.info(`Request [${requestId}]: end`);
    } catch (error) {
      logger.error('Erreur lors du logging de la requête :', error);
    }
  });

  next();
}

// Fonction pour masquer les en-têtes sensibles
function maskSensitiveHeaders(
  headers: Record<string, string | string[] | undefined>,
): Record<string, string | string[] | undefined> {
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
  const maskedHeaders = { ...headers };

  sensitiveHeaders.forEach((header) => {
    if (maskedHeaders[header]) {
      maskedHeaders[header] = '*****';
    }
  });

  return maskedHeaders;
}

function maskSensitiveData(body: Record<string, any>): Record<string, any> {
  const sensitiveFields = ['password', 'token', 'creditCard'];
  const maskedBody = { ...body };

  sensitiveFields.forEach((field) => {
    if (maskedBody[field]) {
      maskedBody[field] = '*****';
    }
  });

  return maskedBody;
}
