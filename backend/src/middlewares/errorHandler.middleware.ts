import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger';
import { AppError } from '../errors/app.error';
import { APP_ENV } from '../config/environment';
import { PrismaClient } from '@prisma/client';
import { ZodError } from 'zod';
import { PrismaError } from '../errors/prisma.errors';

const prisma = new PrismaClient();

export function handleProcessErrors() {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', { reason });
  });

  process.on('SIGINT', async () => {
    logger.info(`errorHandler: 🛑 SIGINT received. Closing server...`);
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info(`errorHandler: 🛑 SIGTERM received. Closing server...`);
    process.exit(0);
  });
}

const sendErrorDev = (error: Error, request: Request, response: Response) => {
  logger.error(`errorHandler: [${request.requestId}]: sendErrorDev: ${error}`);
  let { status, statusCode } = error as any;

  response.status(statusCode ?? 500).json({
    status: status ?? 'error',
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorProd = (error: Error, request: Request, response: Response) => {
  logger.error(`errorHandler: [${request.requestId}]: sendErrorProd: ${error}`);
  response.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.error(`errorHandler: [${request.requestId}]: ${error}`);

  if (APP_ENV.NODE_ENV === 'dev') {
    sendErrorDev(error, request, response);
  } else {
    if (error instanceof ZodError) {
      response.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: error.errors,
      });
    } else if (error instanceof PrismaError) {
      response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        prismaCode: error.prismaCode,
      });

      sendErrorProd(error, request, response);
    }
  }

  next();
};
