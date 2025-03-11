import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger';

export function requestLogger(request: Request, response: Response, next: NextFunction) {
  const start = Date.now();

  response.on('finish', () => {
    try {
      const duration = Date.now() - start;
      const requestId = request.requestId || '<none>';

      // Données à logger
      const logData = {
        timestamp: new Date().toISOString(),
        method: request.method,
        requestId,
        url: request.originalUrl,
        statusCode: response.statusCode,
        duration: `${duration}ms`,
        headers: maskSensitiveHeaders(request.headers),
        body: maskSensitiveData(request.body),
      };

      logger.info(logData);
    } catch (error) {
      logger.error('Erreur lors du logging de la requête :', error);
    }
  });

  next();
}

// Fonction pour masquer les en-têtes sensibles
function maskSensitiveHeaders(headers: Record<string, string | string[] | undefined>): Record<string, string | string[] | undefined> {
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
  const maskedHeaders = { ...headers };

  sensitiveHeaders.forEach(header => {
    if (maskedHeaders[header]) {
      maskedHeaders[header] = '*****';
    }
  });

  return maskedHeaders;
}

function maskSensitiveData(body: Record<string, any>): Record<string, any> {
  const sensitiveFields = ['password', 'token', 'creditCard'];
  const maskedBody = { ...body };

  sensitiveFields.forEach(field => {
    if (maskedBody[field]) {
      maskedBody[field] = '*****';
    }
  });

  return maskedBody;
}