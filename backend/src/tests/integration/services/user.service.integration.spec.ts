import { Role } from '@prisma/client';
import { UserService } from '../../../services/user.service';
import { PrismaUserRepository } from '../../../repositories/user/PrismaUserRepository';
import { Container } from '../../../container';
import { UserModel } from '../../../models/user.model';

describe('UserService Integration', () => {
  let service: UserService;
  let email: string;
  let password: string;
  let name: string;
  let role: Role;
  let isActive: true;
  let date: Date;

  beforeAll(async () => {
    service = new UserService(
      new PrismaUserRepository(
        Container.getPrismaClient(),
        Container.getPrismaClient().user,
        UserModel.name,
        UserModel.defaultFields,
        UserModel.searchableFields,
      ),
    );

    date = new Date();
    email = 'test2@test2.com';
    password = 'Password-123';
    name = 'Test User';
    role = Role.USER;
    isActive = true;
  });

  afterAll(async () => {});

  it('should create and retrieve user', async () => {
    const created = await service.create(email, password, name, role, isActive);
    const found = await service.findById(created.id);
    expect(found?.email).toBe(email);
  });
});
