import { Request, Response } from 'express';
import { logger } from '../logger/logger';
import {
  UserCreateSchema,
  UserEmailSchema,
  UserFindAllSchema,
  UserIdSchema,
  userIdValidation,
  UserPasswordSchema,
  UserSearchSchema,
  UserUpdateSchema,
} from '../schemas/user.schema';
import { UserCreateZodDTO, UserFindAllZodDTO, UserUpdateZodDTO } from '../dtos/user.dto';

import { asyncHandler } from '../middlewares/async.handler.middleware';
import {
  UserCreationFailedError,
  UserDeletionFailedError,
  UserNotFoundError,
  UserUpdateFailedError,
} from '../errors/user.errors';
import { UserPublicSelect, UserQueryOptions } from '../models/user.model';
import { Container } from '../container';

const userService = Container.getUserService();

/**
 * Retrieves all users.
 * - Fetches the public profiles of all users.
 * - Returns the list of users.
 */
export const findAll = asyncHandler(
  async (request: Request, response: Response) => {
    logger.debug(
      `user.controller: findAll: [req:${request.requestId}]: findAllHandler`,
    );

    const { paginationOptions, orderBy }: UserFindAllZodDTO = UserFindAllSchema.parse(request.query);
  

    const users = await userService.findAll(orderBy, paginationOptions);

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
    logger.debug(
      `user.controller: findAllPublic: [req:${request.requestId}]: findAllPublic`,
    );
    const { paginationOptions, orderBy }: UserFindAllZodDTO = UserFindAllSchema.parse(request.query);

    const users = await userService.findAll(orderBy, paginationOptions, UserPublicSelect);

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
    logger.debug(
      `user.controller: findMe: [req:${request.requestId}]: findMe`,
    );

    const userId = userIdValidation.parse(request.user?.id);

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
    logger.debug(
      `user.controller: findById: [req:${request.requestId}]: findById`,
    );

    const { id } = UserIdSchema.parse(request.params);

    const user = await userService.findById(id);

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
export const findPublicById = asyncHandler(
  async (request: Request, response: Response) => {
    logger.debug(
      `user.controller: findPublicById: [req:${request.requestId}]: findPublicById`,
    );
    const { id } = UserIdSchema.parse(request.params);

    const user = await userService.findByIdToPublic(id);

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
    logger.debug(
      `user.controller: findByRole: [req:${request.requestId}]: findByRole`,
    );
    const { paginationOptions, orderBy, role }: UserFindAllZodDTO = UserFindAllSchema.parse(request.query);

    const users = await userService.search({ role }, orderBy, paginationOptions, UserPublicSelect);

    response.json(users);
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
    logger.debug(
      `user.controller: findUserByEmailHandler: [req:${request.requestId}]: findUserByEmailHandler`,
    );
    const { email } = UserEmailSchema.parse(request.params);
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    response.json(user);
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
    logger.debug(
      `user.controller: existsByEmail: [req:${request.requestId}]: existsByEmail`,
    );
    const { email } = UserEmailSchema.parse(request.params);
    const exists = await userService.existsByEmail(email);
    response.json({ exists });
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
    logger.debug(
      `user.controller: search: [req:${request.requestId}]: search`,
    );

    const { paginationOptions, orderBy, searchTerm, email, role, name } = UserSearchSchema.parse(request.query);

    const queryOptions: UserQueryOptions = {
      searchTerm,
      email,
      role,
      name,
    };

    const users = await userService.search(queryOptions, orderBy, paginationOptions);

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
    logger.debug(
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
    logger.debug(
      `user.controller: update: [req:${request.requestId}]: update`,
    );

    const { id } = UserIdSchema.parse(request.params);
    const { name, email, role }: UserUpdateZodDTO = UserUpdateSchema.parse(
      request.body,
    );

    const user = await userService.update(id, { name, email, role });

    if (!user) {
      throw new UserUpdateFailedError(id);
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
    logger.debug(
      `user.controller: updatePassword: [req:${request.requestId}]: updatePassword`,
    );
    const { id } = UserIdSchema.parse(request.params);
    const { currentPassword, newPassword } = UserPasswordSchema.parse(request.body);
    const user = await userService.updatePassword(id, currentPassword, newPassword);
    if (!user) {
      throw new UserUpdateFailedError(id);
    }
    response.json(user);
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
    logger.debug(
      `user.controller: deactivate: [req:${request.requestId}]: deactivate`,
    );
    const { id } = UserIdSchema.parse(request.params);
    const user = await userService.deactivate(id);
    if (!user) {
      throw new UserUpdateFailedError(id);
    }
    response.json(user);
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
    logger.debug(
      `user.controller: reactivate: [req:${request.requestId}]: reactivate`,
    );
    const { id } = UserIdSchema.parse(request.params);
    const user = await userService.reactivate(id);
    if (!user) {
      throw new UserUpdateFailedError(id);
    }
    response.json(user);
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
    logger.debug(
      `user.controller: remove: [req:${request.requestId}]: remove`,
    );

    const { id } = UserIdSchema.parse(request.params);

    const user = await userService.delete(id);

    if (!user) {
      throw new UserDeletionFailedError(id);
    }

    response.status(204).send();
  },
);
