import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { APP_ENV } from '../../../config/environment';
import { generateToken, hashPassword } from '../../../tests/utils/test-utils';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('../../../config/environment');

describe('generateToken', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@neuro.app',
    role: 'USER'
  } as User;

  beforeEach(() => {
    (APP_ENV as any) = {
      JWT_SECRET: 'test-secret',
      JWT_EXPIRATION: '1h'
    };
  });

  it('should generate valid JWT token', () => {
    (jwt.sign as jest.Mock).mockReturnValue('mock-token');
    
    const token = generateToken(mockUser);
    
    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: 'user-123', email: 'test@neuro.app', role: 'USER' },
      'test-secret',
      { expiresIn: '1h' }
    );
    expect(token).toBe('mock-token');
  });
});

describe('hashPassword', () => {
  it('should return hash and salt', async () => {
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('mock-salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('mock-hash');

    const result = await hashPassword('Test1234!');
    
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith('Test1234!', 'mock-salt');
    expect(result).toEqual({
      hash: 'mock-hash',
      salt: 'mock-salt'
    });
  });
});