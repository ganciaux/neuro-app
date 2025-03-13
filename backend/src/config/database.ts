import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/logger';

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

function formatExecutableQuery(query: string, params: string): string {

  const parsedParams = JSON.parse(params) as unknown[];

  let executableQuery = query;
  parsedParams.forEach((param, index) => {
    const value = typeof param === 'string' ? `'${param}'` : param;
    executableQuery = executableQuery.replace(`$${index + 1}`, (value as any).toString());
  });

  return executableQuery;
}

prisma.$on('query', (e) => {
  logger.info(`database: Prisma query: ${e.query}; params=${e.params} duration=${e.duration}ms`);
  logger.info(`database: SQL query: ${formatExecutableQuery(e.query, e.params)};`);
});

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    logger.info('database: ✅ Connected to PostgreSQL');
  } catch (err) {
    logger.error('database: ❌ Database connection error:', err);
    process.exit(1);
  }
}
