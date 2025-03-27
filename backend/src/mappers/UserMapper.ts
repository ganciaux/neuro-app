import { UserPublicDto } from '../models/user.model';
import { User } from '@prisma/client';
export class UserMapper {
  static toPublic(user: User): UserPublicDto {
    const { passwordHash, passwordSalt, ...data } = user;
    return {
      ...data,
      fullName: `${user.name}`
    };
  }
}