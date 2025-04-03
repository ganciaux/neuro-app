import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/logger';

/**
 * Prisma client instance with custom logging.
 */
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

// Log Prisma queries and their executable SQL versions
prisma.$on('query', (e) => {
  logger.info(
    `database: Prisma query: ${e.query}; params=${e.params} duration=${e.duration}ms`,
  );
  logger.info(
    `database: SQL query: ${formatExecutableQuery(e.query, e.params)};`,
  );
});

/**
 * Connects to the PostgreSQL database.
 * @throws {Error} If the connection fails.
 */
export async function prismaConnect(src: string=""): Promise<void> {
  try {
    await prisma.$connect();
    logger.info(`database: ✅ Connected to PostgreSQL: ${src}`);
    logger.info(`database: url: ${process.env.DATABASE_URL}`);
    logger.info(`database: env: ${process.env.NODE_ENV}`);
  } catch (err) {
    logger.error('database: ❌ Database connection error:', err);
    process.exit(1);
  }
}

/**
 * Disconnects from the PostgreSQL database.
 */
export async function prismaDisconnect(src: string=""): Promise<void> {
  await prisma.$disconnect();
  logger.info(`database: ✅ Disconnected from PostgreSQL: ${src}`);
}
