import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from './repositories/user/PrismaUserRepository';
import { UserService } from './services/user.service';
import { prisma } from './config/database';
import { IUserRepository } from './repositories/user/IUserRepository';

export class Container {
    // Singleton de base de données
    private static prismaClient: PrismaClient;

    // Repositories
    private static userRepository: IUserRepository;

    // Services
    private static userService: UserService;

    // Méthode pour obtenir le client Prisma
    static getPrismaClient(): PrismaClient {
        if (!Container.prismaClient) {
            Container.prismaClient = prisma;
        }
        return Container.prismaClient;
    }

    // Méthodes pour les repositories
    static getUserRepository(): IUserRepository {
        if (!Container.userRepository) {
            // Correction de l'instanciation de PrismaUserRepository
            // En respectant la signature du constructeur de BasePrismaRepository
            Container.userRepository = new PrismaUserRepository(
                Container.getPrismaClient(),
                Container.getPrismaClient().user,
                'User',
                ['id', 'email', 'name', 'createdAt', 'updatedAt'],
                ['email', 'name']
            );
        }
        return Container.userRepository;
    }

    // Méthodes pour les services
    static getUserService(): UserService {
        if (!Container.userService) {
            Container.userService = new UserService(Container.getUserRepository());
        }
        return Container.userService;
    }
}