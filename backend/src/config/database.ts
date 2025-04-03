import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/logger';

/**
 * Prisma client instance with custom logging.
 */
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'test' ? [] :[
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
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

/**
 * Formats a raw SQL query with its parameters into an executable query.
 * @param query - The raw SQL query.
 * @param params - The parameters as a JSON string.
 * @returns The formatted executable query.
 */
function formatExecutableQuery(query: string, params: string): string {
  const parsedParams = JSON.parse(params) as unknown[];

  let executableQuery = query;
  parsedParams.forEach((param, index) => {
    const value = typeof param === 'string' ? `'${param}'` : param;
    executableQuery = executableQuery.replace(
      `$${index + 1}`,
      (value as any).toString(),
    );
  });

  return executableQuery;
}

prisma.$on('query', (e) => {
  if (process.env.NODE_ENV === 'production' && e.duration > 500) {
    logger.warn(`database:Slow query (${e.duration}ms): ${formatExecutableQuery(e.query, e.params)}`);
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    logger.debug(`database:Prisma query: ${e.query}`);
    logger.verbose(`database:SQL executed: ${formatExecutableQuery(e.query, e.params)}`);
    logger.debug(`database:Duration: ${e.duration}ms`);
  }
});

/**
 * Connects to the PostgreSQL database.
 * @throws {Error} If the connection fails.
 */
export async function prismaConnect(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info(`database: ✅ Connected to PostgreSQL`);
    logger.debug(`database: url: ${process.env.DATABASE_URL}`);
    logger.info(`database: env: ${process.env.NODE_ENV}`);
  } catch (err) {
    logger.error('database: ❌ Database connection error:', err);
    process.exit(1);
  }
}

/**
 * Disconnects from the PostgreSQL database.
 */
export async function prismaDisconnect(): Promise<void> {
  await prisma.$disconnect();
  logger.info(`database: 🔌 Disconnected from PostgreSQL`);
}
