import { Role, User } from "@prisma/client";
import { IUserRepository } from "../../../repositories/user/IUserRepository";
import { UserService } from "../../../services/user.service";
import { UserPublicDto } from "../../../models/user.model";
import { bcryptMock, userRepositoryMock } from "../setup";

describe('UserService', () => {
  let service: UserService;
  let repositoryMock: jest.Mocked<IUserRepository>;
  let email: string;
  let password: string;
  let name: string;
  let role: Role;
  let isActive: true;
  let user: User;
  let publicUser: UserPublicDto;
  let date: Date;

  beforeEach(() => {
    date = new Date();
    email = 'test@test.com';
    password = 'Password-123';
    name = 'Test User';
    role = Role.USER;
    isActive = true;

    user = {
      id: "1",
      email,
      name,
      passwordHash: 'mockedHashedPassword',
      passwordSalt: 'mockedSalt',
      role,
      isActive,
      createdAt: date,
      updatedAt: date
    }

    publicUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      fullName: `${user.name}`
    }
   
    bcryptMock.genSalt.mockImplementation((rounds) => Promise.resolve('testSalt'));
    bcryptMock.hash.mockImplementation((data, salt) => Promise.resolve('testHash'));
    bcryptMock.compare.mockImplementation((data, encrypted) => Promise.resolve(true));

    repositoryMock = userRepositoryMock;
    repositoryMock.find = jest.fn().mockResolvedValue({ data: [], total: 0 });
    service = new UserService(repositoryMock);
  });

  test('bcrypt should be mocked', async () => {
    console.log('Mock info:', bcryptMock.genSalt);
    

    expect(jest.isMockFunction(bcryptMock.genSalt)).toBe(true);
  });

  it('should email be invalid', async () => {
    email = 'invalid-email';
    await expect(
      service.create(email, password, name, role, isActive)
    ).rejects.toThrow('Invalid email format');

    expect(repositoryMock.existsByEmail).not.toHaveBeenCalled();
    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it('should enforce password strength', async () => {
    password = 'weak';
    await expect(
      service.create(email, password, name, role, isActive)
    ).rejects.toThrow('Password is not strong enough');

    expect(repositoryMock.existsByEmail).not.toHaveBeenCalled();
    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it('should reject duplicate emails', async () => {
    repositoryMock.existsByEmail.mockResolvedValue(true);

    await expect(
      service.create(email, password, name, role, isActive)
    ).rejects.toThrow('Email already in use');

    expect(repositoryMock.existsByEmail).toHaveBeenCalledWith(email);
    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it('should create a user when data is valid', async () => {

    repositoryMock.existsByEmail.mockResolvedValue(false);
    repositoryMock.create.mockResolvedValue(user);

    const userCreated = await service.create(email, password, name, role, isActive);

    expect(repositoryMock.existsByEmail).toHaveBeenCalledWith(email);
    expect(repositoryMock.create).toHaveBeenCalled();
    expect(user).toEqual(userCreated);
  });

  it('should handle repository errors', async () => {
    repositoryMock.existsByEmail.mockResolvedValue(false);
    repositoryMock.create.mockRejectedValue(new Error('Database error'));

    await expect(
      service.create(email, password, name, role, isActive)
    ).rejects.toThrow('Database error');

    expect(repositoryMock.existsByEmail).toHaveBeenCalledWith(email);
    expect(repositoryMock.create).toHaveBeenCalled();
  });

  it('should throw error if user not found in updatePassword', async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(service.updatePassword('1', 'oldPass', 'newPass'))
      .rejects.toThrow('User not found');

    expect(repositoryMock.findById).toHaveBeenCalledWith('1');
  });

  it('should throw error if current password is incorrect', async () => {
    repositoryMock.findById.mockResolvedValue(user);
    bcryptMock.compare.mockImplementation((data, encrypted) => Promise.resolve(false));

    await expect(service.updatePassword('1', 'wrongPass', 'newPass'))
      .rejects.toThrow('Current password is incorrect');

    expect(repositoryMock.findById).toHaveBeenCalledWith('1');
    expect(bcryptMock.compare).toHaveBeenCalledWith('wrongPass', user.passwordHash);
  });

  it('should update password if current password is correct', async () => {
    let newPassword = 'newPass';
    let newPasswordHash = 'newHashedPassword';
    let newPasswordSalt = 'newSalt';
    repositoryMock.findById.mockResolvedValue(user);
    repositoryMock.update.mockResolvedValue({ ...user, passwordHash: newPasswordHash, passwordSalt: newPasswordSalt });
    bcryptMock.genSalt.mockImplementation((rounds) => Promise.resolve(newPasswordSalt));
    bcryptMock.hash.mockImplementation((data, salt) => Promise.resolve(newPasswordHash));

    const updatedUser = await service.updatePassword(user.id, password, newPassword);

    expect(bcryptMock.compare).toHaveBeenCalledWith(password, user.passwordHash);
    expect(bcryptMock.genSalt).toHaveBeenCalled();
    expect(bcryptMock.hash).toHaveBeenCalledWith(newPassword, newPasswordSalt);
    expect(repositoryMock.update).toHaveBeenCalledWith(user.id, {
      passwordHash: newPasswordHash,
      passwordSalt: newPasswordSalt,
    });

    expect(updatedUser.passwordHash).toBe(newPasswordHash);
    expect(updatedUser.passwordSalt).toBe(newPasswordSalt);
  });

  it('should return true if password matches', async () => {
    bcryptMock.compare.mockImplementation((data, encrypted) => Promise.resolve(true));

    const result = await service.verifyPassword(user, password);

    expect(bcryptMock.compare).toHaveBeenCalledWith(password, user.passwordHash);
    expect(result).toBe(true);
  });

  it('should return false if password does not match', async () => {
    let wrongPassword = "WrongPassword";
    bcryptMock.compare.mockImplementation((data, encrypted) => Promise.resolve(false));

    const result = await service.verifyPassword(user, wrongPassword);

    expect(bcryptMock.compare).toHaveBeenCalledWith(wrongPassword, user.passwordHash);
    expect(result).toBe(false);
  });

  it('should return null if user is not found in findByIdToPublic', async () => {
    repositoryMock.findById.mockResolvedValue(null);

    const result = await service.findByIdToPublic('1');

    expect(repositoryMock.findById).toHaveBeenCalledWith('1');
    expect(result).toBeNull();
  });

  it('should return public user data if user is found', async () => {
    repositoryMock.findById.mockResolvedValue(user);

    jest.spyOn(service, 'toUserPublic').mockReturnValue(publicUser);

    const result = await service.findByIdToPublic(user.id);
  
    expect(repositoryMock.findById).toHaveBeenCalledWith('1');
    expect(service.toUserPublic).toHaveBeenCalledWith(user);
    expect(result).toEqual(publicUser);
  });

  it('should return empty list if no users found in findAllToPublic', async () => {
    repositoryMock.find.mockResolvedValue([]);
  
    const result = await service.findAllToPublic();
  
    expect(repositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
  
  it('should return public user list if users are found', async () => {
    const users = [user, {...user, id: '2'}];
    repositoryMock.find.mockResolvedValue(users);
  
    const publicUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      fullName: `${user.name}`
    }));

    jest.spyOn(service, 'toUserPublicList').mockReturnValue(publicUsers);
  
    const result = await service.findAllToPublic();
  
    expect(repositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual(publicUsers);
  });
  
  it('should return paginated public user list if pagination applied', async () => {
    const paginatedUsers = { data: [user, user], total: 2, page: 1, pageSize: 10, totalPages: 1 };
    repositoryMock.find.mockResolvedValue(paginatedUsers);
  
    const publicUsers = paginatedUsers.data.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      fullName: `${user.name}`
    }));
    jest.spyOn(service, 'toUserPublicList').mockReturnValue(publicUsers);
  
    const result = await service.findAllToPublic();
  
    expect(repositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual({ ...paginatedUsers, data: publicUsers });
  });
  
});