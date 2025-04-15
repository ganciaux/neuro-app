import { Role } from '@prisma/client';
import { UserService } from '../../../services/user.service';
import { PrismaUserRepository } from '../../../repositories/user/PrismaUserRepository';
import { Container } from '../../../container';
import { UserModel } from '../../../models/user.model';
import { userFixture } from '../../fixtures/users';
describe('UserService Integration', () => {
  let service: UserService;

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
  });

  afterAll(async () => {});

  it('should create and retrieve user', async () => {
    const userFake = userFixture.build();
    const user = await service.create(userFake.email, userFake.password, userFake.name, userFake.role, userFake.isActive);
    expect(user).not.toBeNull();
    expect(user).toMatchObject({email: userFake.email, name: userFake.name, role: userFake.role, isActive: userFake.isActive});
    const found = await service.findById(user.id);
    expect(found).toMatchObject({email: user.email, name: user.name, role: user.role, isActive: user.isActive});
  });

  it('should delete user', async () => {
    const userFake = userFixture.build();
    const user = await service.create(userFake.email, userFake.password, userFake.name, userFake.role, userFake.isActive);
    expect(user).not.toBeNull();
    expect(user).toMatchObject({email: userFake.email, name: userFake.name, role: userFake.role, isActive: userFake.isActive});
    await service.delete(user.id);
    const found = await service.findById(user.id);
    expect(found).toBeNull();
  });
});
