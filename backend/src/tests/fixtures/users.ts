import { PrismaClient, Role, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createUser } from '../test-helpers';
import { UserFixtureOptions, UserOptions } from '../../models/user.model';

export const userFixture = {
  create: async (
    prisma: PrismaClient,
    options: UserOptions = {}
  ): Promise<User> => {
    return createUser(
      prisma,
      options.email || faker.internet.email().toLowerCase(),
      options.name || faker.person.fullName(),
      options.role || Role.USER,
      options.password || `${faker.internet.password()}1A!`,
      options.isActive ?? true 
    );
  },

  build: (options: Partial<UserOptions> = {}): UserFixtureOptions => ({
    email: options.email || faker.internet.email().toLowerCase(),
    name: options.name || faker.person.fullName(),
    password: options.password || `${faker.internet.password()}1A!`,
    role: options.role || Role.USER,
    isActive: options.isActive ?? true,
  }),
};