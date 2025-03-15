import { Router } from 'express';
import {
  getProfile,
  getAllUsers,
  getUserById,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../../controllers/user.controller';
import { adminGuard, authGuard } from '../../middlewares/auth.middleware';

/**
 * Express router for user-related routes.
 */
const router = Router();

/**
 * Route to fetch the authenticated user's profile.
 * - GET /me
 * - Requires authentication.
 */
router.get('/me', authGuard, getProfile);

/**
 * Route to fetch a user by ID.
 * - GET /:id
 * - Requires authentication and admin privileges.
 */
router.get('/:id', authGuard, adminGuard, getUserById);

/**
 * Route to fetch all users.
 * - GET /
 * - Requires authentication and admin privileges.
 */
router.get('/', authGuard, adminGuard, getAllUsers);

/**
 * Route to create a new user.
 * - POST /
 * - Requires authentication and admin privileges.
 */
router.post('/', authGuard, adminGuard, createUserHandler);

/**
 * Route to update a user by ID.
 * - PUT /:id
 * - Requires authentication and admin privileges.
 */
router.put('/:id', authGuard, adminGuard, updateUserHandler);

/**
 * Route to delete a user by ID.
 * - DELETE /:id
 * - Requires authentication and admin privileges.
 */
router.delete('/:id', authGuard, adminGuard, deleteUserHandler);

/**
 * Exports the user router.
 */
export default router;
