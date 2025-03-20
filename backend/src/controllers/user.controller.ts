import { Request, Response } from 'express';
import { logger } from '../logger/logger';
import {
  UserCreateSchema,
  UserIdSchema,
  UserSearchSchema,
  UserUpdateSchema,
} from '../schemas/user.schema';
import { UserCreateZodDTO, UserUpdateZodDTO } from '../dtos/user.dto';

import { asyncHandler } from '../middlewares/async.handler.middleware';
import {
  InvalidUserIdError,
  UserCreationFailedError,
  UserNotFoundError,
  UserUpdateFailedError,
} from '../errors/user.errors';
import { UserFilterOptions, UserRole } from '../models/user.model';
import { Container } from '../container';
import { PaginationOptions } from '../common/types';

const userService = Container.getUserService();

/**
 * Retrieves all users.
 * - Fetches the public profiles of all users.
 * - Returns the list of users.
 */
export const findAllHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findAllHandler: [req:${request.requestId}]: findAllHandler`,
    );

    const { page, pageSize, name, email, role } = UserSearchSchema.parse(request.query);
    
    const paginationOptions: PaginationOptions = {
      page,
      pageSize,
    };

    const filterOptions: UserFilterOptions = {
      name,
      email,
      role,
    };

    const users = await userService.findAll(paginationOptions, filterOptions);

    response.json(users);
  },
);

/**
 * Retrieves the profile of the authenticated user.
 * - Validates the user ID.
 * - Fetches the user's public profile.
 * - Returns the user's profile.
 */
export const findMeHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findMeHandler: [req:${request.requestId}]: findMeHandler`,
    );

    const { userId } = UserIdSchema.parse(request.body);
    //const userId = request.user?.id;

    if (!userId) {
      throw new UserNotFoundError();
    }

    const user = await userService.findByIdToPublic(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    response.json(user);
  },
);

/**
 * Retrieves a user by their ID.
 * - Validates the user ID.
 * - Fetches the user's public profile.
 * - Returns the user's profile.
 */
export const findUserByIdHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findUserByIdHandler: [req:${request.requestId}]: findUserByIdHandler`,
    );

    const { userId } = UserIdSchema.parse(request.params);
    //const userId = request.params.id;

    if (!userService.isValidUserId(userId)) {
      throw new InvalidUserIdError();
    }

    if (await userService.existsById(userId)) {
      throw new UserNotFoundError(userId);
    }

    const user = await userService.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    response.json(user);
  },
);

/**
 * Retrieves a user's public profile by their ID.
 * - Validates the user ID.
 * - Fetches the user's public profile.
 * - Returns the user's public profile.
 */
export const findUserPublicByIdHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findUserPublicByIdHandler: [req:${request.requestId}]: findUserPublicByIdHandler`,
    );
    const { userId } = UserIdSchema.parse(request.params);
    //const userId = request.params.id;

    if (!userId) {
      throw new UserNotFoundError();
    }

    const user = await userService.findByIdToPublic(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    response.json(user);
  },
);

/**
 * Retrieves all public users.
 * - Fetches the public profiles of all users.
 * - Returns the list of users.
 */
export const findAllPublicHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findAllPublicHandler: [req:${request.requestId}]: findAllPublicHandler`,
    );
    return;
  },
);

/**
 * Retrieves users by role  .
 * - Validates the role.
 * - Fetches the users matching the role.
 * - Returns the list of users.
 */
export const findUsersByRoleHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findUsersByRoleHandler: [req:${request.requestId}]: findUsersByRoleHandler`,
    );
    return;
  },
);

/**
 * Retrieves a user by email  .
 * - Validates the email.
 * - Fetches the user matching the email.
 * - Returns the user's public profile.
 */
export const findUserByEmailHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findUserByEmailHandler: [req:${request.requestId}]: findUserByEmailHandler`,
    );
    return;
  },
);

/**
 * Checks if a user exists by email.
 * - Validates the email.
 * - Checks if the user exists.
 * - Returns true if the user exists, false otherwise.
 */
export const userExistsByEmailHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: userExistsByEmailHandler: [req:${request.requestId}]: userExistsByEmailHandler`,
    );
    return;
  },
);

/**
 * Searches users by name or email.
 * - Validates the search term.
 * - Fetches the users matching the search term.
 * - Returns the list of users.
 */
export const searchUsersHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: searchUsersHandler: [req:${request.requestId}]: searchUsersHandler`,
    );

    const paginationOptions = {
      page: parseInt(request.query.page as string, 10) || 1,
      pageSize: parseInt(request.query.pageSize as string, 10) || 10,
    };

    const filterOptions: UserFilterOptions = {
      name: request.query.name as string,
      email: request.query.email as string,
      role: request.query.role as UserRole,
    };

    const users = await userService.findAll(paginationOptions, filterOptions);

    response.json(users);
  },
);

/**
 * Creates a new user.
 * - Validates the request body using `UserCreateSchema`.
 * - Checks if the email already exists.
 * - Creates the user and returns their public profile.
 */
export const createUserHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: createUserHandler: [req:${request.requestId}]: createUserHandler`,
    );

    const { email, password, name, role }: UserCreateZodDTO =
      UserCreateSchema.parse(request.body);

    const user = await userService.create(email, password, name, role, false);

    if (!user) {
      throw new UserCreationFailedError(email);
    }

    const userPublic = userService.toUserPublic(user);

    response.status(201).json(userPublic);
  },
);

/**
 * Updates a user by their ID.
 * - Validates the user ID.
 * - Updates the user's details.
 * - Returns the updated user's public profile.
 */
export const updateUserHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: updateUser: [req:${request.requestId}]: updateUser`,
    );
    //const userId = request.params.id;
    //const { name, email, role } = request.body;

    const { userId } = UserIdSchema.parse(request.params);
    const { name, email, role }: UserUpdateZodDTO = UserUpdateSchema.parse(
      request.body,
    );

    const user = await userService.update(userId, { name, email, role });

    if (!user) {
      throw new UserUpdateFailedError(userId);
    }

    const userPublic = userService.toUserPublic(user);

    response.json(userPublic);
  },
);

/**
 * Updates a user's password by their  ID.
 * - Validates the user ID.
 * - Updates the user's password.
 * - Returns the updated user's public profile.
 */
export const updateUserPasswordHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: updateUserPasswordHandler: [req:${request.requestId}]: updateUserPasswordHandler`,
    );
    return;
  },
);

/**
 * Deactivates a user by their ID.
 * - Validates the user ID.
 * - Deactivates the user.
 * - Returns a 204 status code (No Content).
 */
export const deactivateUserHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: deactivateUserHandler: [req:${request.requestId}]: deactivateUserHandler`,
    );
    return;
  },
);

/**
 * Reactivates a user by their ID.
 * - Validates the user ID.
 * - Reactivates the user.
 * - Returns a 204 status code (No Content).
 */
export const reactivateUserHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: reactivateUserHandler: [req:${request.requestId}]: reactivateUserHandler`,
    );
    return;
  },
);

/**
 * Deletes a user by their ID.
 * - Validates the user ID.
 * - Deletes the user.
 * - Returns a 204 status code (No Content).
 */
export const deleteUserHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: deleteUser: [req:${request.requestId}]: deleteUser`,
    );
    //const userId = request.params.id;

    const { userId } = UserIdSchema.parse(request.body);

    if (!userService.isValidUserId(userId)) {
      throw new InvalidUserIdError();
    }

    if (await userService.existsById(userId)) {
      throw new UserNotFoundError(userId);
    }

    const user = await userService.delete(userId);

    response.status(204).send();
  },
);
