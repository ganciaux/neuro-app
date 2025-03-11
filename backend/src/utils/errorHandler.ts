import { logger } from '../logger/logger';

export function handleProcessErrors() {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', { reason });
  });

  process.on('SIGINT', async () => {
    logger.info('🛑 SIGINT received. Closing server...');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('🛑 SIGTERM received. Closing server...');
    process.exit(0);
  });
}
