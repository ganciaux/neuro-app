// tests/global-setup.ts
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
  await prismaConnect();

  //await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;

  await prismaDisconnect();
};
