import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { email: 'test1@example.com', name: 'Test User 1', passwordHash: "", passwordSalt:""  },
      { email: 'test2@example.com', name: 'Test User 2', passwordHash: "", passwordSalt:"" },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });