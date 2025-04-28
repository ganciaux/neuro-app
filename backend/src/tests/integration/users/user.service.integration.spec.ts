import { User } from '@prisma/client';
import { UserService } from '../../../services/user.service';
import { PrismaUserRepository } from '../../../repositories/user/PrismaUserRepository';
import { Container } from '../../../container';
import { UserFixtureOptions, UserModel } from '../../../models/user.model';
import { userFixture } from '../../fixtures/users';
import { prisma } from '../../../config/database';

describe('UserService Integration', () => {
  let service: UserService;
  let userFake: UserFixtureOptions;
  let user: User;

  beforeAll(async () => {
    service = new UserService(
      new PrismaUserRepository(
        Container.getPrismaClient(),
        Container.getPrismaClient().user,
        UserModel.name,
        UserModel.defaultFields,
        UserModel.searchableFields,
      )
    );
  });

  beforeEach(async () => {
    userFake = userFixture.build();
    user = await service.create(userFake.email, userFake.password, userFake.name, userFake.role, userFake.isActive);
    expect(user).not.toBeNull();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {});

  it('should create and retrieve user', async () => {
    expect(user).toMatchObject({email: userFake.email, name: userFake.name, role: userFake.role, isActive: userFake.isActive});
    const found = await service.findById(user.id);
    expect(found).toMatchObject({email: user.email, name: user.name, role: user.role, isActive: user.isActive});
    const existsByEmail = await service.existsByEmail(user.email); 
    expect(existsByEmail).toBe(true);
    const existsById = await service.existsById(user.id);
    expect(existsById).toBe(true);
  });

  it('should delete user', async () => {
    expect(user).toMatchObject({email: userFake.email, name: userFake.name, role: userFake.role, isActive: userFake.isActive});
    await service.delete(user.id);
    const found = await service.findById(user.id);
    expect(found).toBeNull();
  });

  it('should activate and deactivate user', async () => {
    expect(user.isActive).toBe(true);
    const userDeactivated = await service.deactivate(user.id);
    expect(userDeactivated.isActive).toBe(false);
    const userReactivated = await service.reactivate(user.id);
    expect(userReactivated.isActive).toBe(true);
  });

  it('should verify password correctly', async () => {
     expect(await service.verifyPassword(user, userFake.password)).toBe(true);
  });

  it('should reject wrong passwords', async () => {
     expect(await service.verifyPassword(user,'WrongPass123')).toBe(false);
  });

  it('should update password correctly', async () => {
     const newPassword = 'NewSecurePass123!';
    const updatedUser = await service.updatePassword(user.id, userFake.password, newPassword);
    expect(updatedUser).not.toBeNull();
    expect(await service.verifyPassword(updatedUser, newPassword)).toBe(true);
  });

    /*
      service.findAll
      service.findAllToPublic
      service.search
      service.toUserPublic
      service.toUserPublicList
      service.findByIdToPublic
      service.update
    */

});
