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
  UserCreationFailedError,
  UserNotFoundError,
  UserUpdateFailedError,
} from '../errors/user.errors';
import { UserFilterOptions, UserPublicSelect } from '../models/user.model';
import { Container } from '../container';
import { PaginationOptions } from '../common/types';
import { Role } from '@prisma/client';

const userService = Container.getUserService();

/**
 * Retrieves all users.
 * - Fetches the public profiles of all users.
 * - Returns the list of users.
 */
export const findAll = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findAll: [req:${request.requestId}]: findAllHandler`,
    );

    const { page, pageSize, orderBy } = UserSearchSchema.parse(request.query);
    
    const paginationOptions: PaginationOptions = {
      page,
      pageSize,
    };

    const users = await userService.findAll(paginationOptions, orderBy);

    response.json(users);
  },
);

/**
 * Retrieves all public users.
 * - Fetches the public profiles of all users.
 * - Returns the list of users.
 */
export const findAllPublic = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findAllPublic: [req:${request.requestId}]: findAllPublic`,
    );
    const { page, pageSize, orderBy } = UserSearchSchema.parse(request.query);
    
    const paginationOptions: PaginationOptions = {
      page,
      pageSize,
    };

    const users = await userService.findAll(paginationOptions, orderBy, UserPublicSelect);

    response.json(users);
  },
);

/**
 * Retrieves the profile of the authenticated user.
 * - Validates the user ID.
 * - Fetches the user's public profile.
 * - Returns the user's profile.
 */
export const findMe = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findMe: [req:${request.requestId}]: findMe`,
    );

    const { userId } = UserIdSchema.parse(request.body);

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
export const findById = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findById: [req:${request.requestId}]: findById`,
    );

    const { userId } = UserIdSchema.parse(request.params);

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
export const findPublicById  = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findPublicById: [req:${request.requestId}]: findPublicById`,
    );
    const { userId } = UserIdSchema.parse(request.params);

    const user = await userService.findByIdToPublic(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    response.json(user);
  },
);

/**
 * Retrieves users by role  .
 * - Validates the role.
 * - Fetches the users matching the role.
 * - Returns the list of users.
 */
export const findByRole = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findByRole: [req:${request.requestId}]: findByRole`,
    );
    throw new Error('Method not implemented.');
    return;
  },
);

/**
 * Retrieves a user by email  .
 * - Validates the email.
 * - Fetches the user matching the email.
 * - Returns the user's public profile.
 */
export const findByEmail = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: findUserByEmailHandler: [req:${request.requestId}]: findUserByEmailHandler`,
    );
    throw new Error('Method not implemented.');
    return;
  },
);

/**
 * Checks if a user exists by email.
 * - Validates the email.
 * - Checks if the user exists.
 * - Returns true if the user exists, false otherwise.
 */
export const existsByEmail = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: existsByEmail: [req:${request.requestId}]: existsByEmail`,
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
export const search = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: search: [req:${request.requestId}]: search`,
    );

    const paginationOptions = {
      page: parseInt(request.query.page as string, 10) || 1,
      pageSize: parseInt(request.query.pageSize as string, 10) || 10,
    };

    const filterOptions: UserFilterOptions = {
      name: request.query.name as string,
      email: request.query.email as string,
      role: request.query.role as Role,
    };

    const users = await userService.findAll(paginationOptions);

    response.json(users);
  },
);

/**
 * Creates a new user.
 * - Validates the request body using `UserCreateSchema`.
 * - Checks if the email already exists.
 * - Creates the user and returns their public profile.
 */
export const create = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: create: [req:${request.requestId}]: create`,
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
export const update = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: update: [req:${request.requestId}]: update`,
    );

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
export const updatePassword = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: updatePassword: [req:${request.requestId}]: updatePassword`,
    );
    throw new Error('Method not implemented.');
    return;
  },
);

/**
 * Deactivates a user by their ID.
 * - Validates the user ID.
 * - Deactivates the user.
 * - Returns a 204 status code (No Content).
 */
export const deactivate = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: deactivate: [req:${request.requestId}]: deactivate`,
    );
    throw new Error('Method not implemented.');
    return;
  },
);

/**
 * Reactivates a user by their ID.
 * - Validates the user ID.
 * - Reactivates the user.
 * - Returns a 204 status code (No Content).
 */
export const reactivate = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: reactivate: [req:${request.requestId}]: reactivate`,
    );
    throw new Error('Method not implemented.');
    return;
  },
);

/**
 * Deletes a user by their ID.
 * - Validates the user ID.
 * - Deletes the user.
 * - Returns a 204 status code (No Content).
 */
export const remove = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: remove: [req:${request.requestId}]: remove`,
    );

    const { userId } = UserIdSchema.parse(request.body);

    const user = await userService.delete(userId);

    response.status(204).send();
  },
);
