import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
console.log('🛠️ Setting up before all tests...');
  await prisma.$connect();
  await prisma.user.deleteMany();
});


afterEach(async () => {
});

afterAll(async () => {
  await prisma.$disconnect();
});
