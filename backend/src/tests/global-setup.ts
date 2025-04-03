import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.test');
dotenv.config({ path: envPath, override: true });

import {
  prisma,
  prismaConnect,
  prismaDisconnect,
} from '../../src/config/database';
import { APP_ENV } from '../../src/config/environment';

export default async () => {
  if (APP_ENV.NODE_ENV !== 'test') {
    throw new Error('⚠️ Les tests doivent utiliser NODE_ENV=test !');
  }

  await prismaConnect("global-setup.ts");

  //await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;

  await prismaDisconnect();
};
