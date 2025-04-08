import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { URL } from 'url';
import { logger } from '../logger/logger';

/**
 * Prisma client instance with custom logging.
 */
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'test'
      ? []
      : [
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
    logger.warn(
      `database: Slow query (${e.duration}ms): ${formatExecutableQuery(e.query, e.params)}`,
    );
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    logger.debug(`database:Prisma query: ${e.query}`);
    logger.verbose(
      `database: SQL executed: ${formatExecutableQuery(e.query, e.params)}`,
    );
    logger.debug(`database: Duration: ${e.duration}ms`);
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

export async function prismaInit() {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    const dbName = dbUrl.pathname.slice(1);
    dbUrl.pathname = '/postgres';
    try {
      execSync(`psql "${dbUrl.toString()}" -c "CREATE DATABASE ${dbName};"`, {
        stdio: 'ignore',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.info(
          `database: ${dbName} already exists or creation failed: ${error.message}`,
        );
      }
    }

    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  } catch (error: unknown) {
    logger.error('database: Global setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

export async function prismaDrop() {
  logger.info('database: Dropping database:', process.env.DATABASE_NAME);

  try {
    await prisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS public CASCADE');
    await prisma.$executeRawUnsafe('CREATE SCHEMA public');
    const dbUser = process.env.DATABASE_USER || 'postgres';
    await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO ${dbUser}`);
    await prisma.$executeRawUnsafe('GRANT ALL ON SCHEMA public TO public');

    logger.info('database: Database schema reset successfully');
  } catch (error) {
    logger.error('database: Global teardown failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}
