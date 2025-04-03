import { prismaDrop } from '../config/database';

/**
 * Global teardown function to clean up the database after tests are run.
 * This function drops the database specified in the environment variables.
 */
export default async () => {
  await prismaDrop();
};
