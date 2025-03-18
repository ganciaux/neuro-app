import { UserPrisma, UserRole } from '../models/user.model';
import { UserCreateDTO, UserUpdateDTO } from '../dtos/user.dto';

export class UserMapper {
  static toEntity(dto: UserCreateDTO | UserUpdateDTO): Partial<UserPrisma> {
    return {
      email: dto.email,
      name: dto.name,
      role: dto.role,
      passwordHash: dto.passwordHash,   //todo change
    };
  }

  static toDTO(user: UserPrisma): UserCreateDTO {
    return {
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      passwordHash: user.passwordHash, //todo change
      passwordSalt: user.passwordSalt,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}