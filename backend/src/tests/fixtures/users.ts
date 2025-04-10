import { PrismaClient, Role, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createUser } from '../test-helpers';

type UserOptions = {
  email?: string;
  role?: Role;
  password?: string;
  isActive?: boolean;
};

export const userFixture = {
  create: async (
    prisma: PrismaClient,
    options: UserOptions = {}
  ): Promise<User> => {
    return createUser(
      prisma,
      options.email || faker.internet.email().toLowerCase(),
      options.role || Role.USER,
      options.password || `${faker.internet.password()}1A!`,
      options.isActive ?? true 
    );
  },

  build: (options: Partial<UserOptions> = {}) => ({
    email: options.email || faker.internet.email().toLowerCase(),
    password: options.password || `${faker.internet.password()}1A!`,
    role: options.role || Role.USER,
    isActive: options.isActive ?? true,
  }),
};