import { Request, Response } from 'express';
import { logger } from '../logger/logger';
import { UserCreateSchema } from '../schemas/user.schema';
import { UserCreateDTO } from '../dtos/user.dto';
import {
  createUser,
  deleteUser,
  findAllUsers,
  findUserPublicById,
  isValidUserId,
  toUserPublic,
  updateUser,
  userExistsByEmail,
  userExistsById,
} from '../services/user.service';
import { asyncHandler } from '../middlewares/async.handler.middleware';
import {
  InvalidUserIdError,
  UserCreationFailedError,
  UserEmailAlreadyExistsError,
  UserNotFoundError,
  UserUpdateFailedError,
} from '../errors/user.errors';

/**
 * Retrieves the profile of the authenticated user.
 * - Validates the user ID.
 * - Fetches the user's public profile.
 * - Returns the user's profile.
 */
export const getProfile = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: getProfile: [req:${request.requestId}]: getProfile`,
    );

    const userId = request.user?.id;

    if (!userId) {
      throw new UserNotFoundError();
    }

    if (!isValidUserId(userId)) {
      throw new InvalidUserIdError();
    }

    const user = await findUserPublicById(userId);

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
export const getUserById = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: getUserById: [req:${request.requestId}]: getUserById`,
    );

    const userId = request.params.id;

    if (!isValidUserId(userId)) {
      throw new InvalidUserIdError();
    }

    const user = await findUserPublicById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    response.json(user);
  },
);

/**
 * Retrieves all users.
 * - Fetches the public profiles of all users.
 * - Returns the list of users.
 */
export const getAllUsers = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(
      `user.controller: getAllUsers: [req:${request.requestId}]: getAllUsers`,
    );

    const users = await findAllUsers();

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

    const { email, password, name, role }: UserCreateDTO =
      UserCreateSchema.parse(request.body);

    if (await userExistsByEmail(email)) {
      throw new UserEmailAlreadyExistsError(email);
    }

    const user = await createUser(email, password, name, role);

    if (!user) {
      throw new UserCreationFailedError(email);
    }

    const userPublic = toUserPublic(user);

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
    const userId = request.params.id;
    const { name, email, role } = request.body;

    if (!isValidUserId(userId)) {
      throw new InvalidUserIdError();
    }

    if (await userExistsById(userId)) {
      throw new UserNotFoundError(userId);
    }

    const user = await updateUser(userId, { name, email, role });

    if (!user) {
      throw new UserUpdateFailedError();
    }

    const userPublic = toUserPublic(user);

    response.json(userPublic);
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
    const userId = request.params.id;

    if (!isValidUserId(userId)) {
      throw new InvalidUserIdError();
    }

    if (await userExistsById(userId)) {
      throw new UserNotFoundError(userId);
    }

    const user = await deleteUser(userId);

    response.status(204).send();
  },
);
