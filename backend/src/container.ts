import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from './repositories/user/PrismaUserRepository';
import { UserService } from './services/user.service';
import { prisma } from './config/database';
import { IUserRepository } from './repositories/user/IUserRepository';
import { AuthService } from './services/auth.service';
import { UserModel } from './models/user.model';

/**
 * Container class for dependency injection and service/repository management.
 * This class provides singleton instances of PrismaClient, UserRepository, and UserService.
 */
export class Container {
  private static prismaClient: PrismaClient;

  private static userRepository: IUserRepository;

  private static userService: UserService;

  private static authService: AuthService;

  /**
   * Returns a singleton instance of PrismaClient.
   * If the instance does not exist, it initializes it with the provided `prisma` client.
   *
   * @returns {PrismaClient} The singleton instance of PrismaClient.
   */
  static getPrismaClient(): PrismaClient {
    if (!Container.prismaClient) {
      Container.prismaClient = prisma;
    }
    return Container.prismaClient;
  }

  /**
   * Returns a singleton instance of IUserRepository.
   * If the instance does not exist, it initializes it with a new PrismaUserRepository.
   *
   * @returns {IUserRepository} The singleton instance of IUserRepository.
   */
  static getUserRepository(): IUserRepository {
    if (!Container.userRepository) {
      Container.userRepository = new PrismaUserRepository(
        Container.getPrismaClient(),
        Container.getPrismaClient().user,
        UserModel.name,
        UserModel.defaultFields,
        UserModel.searchableFields,
      );
    }
    return Container.userRepository;
  }

  /**
   * Returns a singleton instance of UserService.
   * If the instance does not exist, it initializes it with a new UserService,
   * injecting the singleton instance of IUserRepository.
   *
   * @returns {UserService} The singleton instance of UserService.
   */
  static getUserService(): UserService {
    if (!Container.userService) {
      Container.userService = new UserService(Container.getUserRepository());
    }
    return Container.userService;
  }

    /**
   * Returns a singleton instance of AuthService.
   * If the instance does not exist, it initializes it with a new AuthService,
   * injecting the singleton instance of UserService.
   *
   * @returns {AuthService} The singleton instance of AuthService.
   */
    static getAuthService(): AuthService {
      if (!Container.authService) {
        Container.authService = new AuthService(Container.getUserService());
      }
      return Container.authService;
    }
}
