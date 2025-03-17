import { Router } from 'express';
import { findMeHandler, findUserByIdHandler, findUserPublicByIdHandler, findAllPublicHandler, findUserByEmailHandler, userExistsByEmailHandler, findUsersByRoleHandler, findAllUsersHandler, searchUsersHandler, createUserHandler, updateUserHandler, updateUserPasswordHandler, deactivateUserHandler, reactivateUserHandler, deleteUserHandler } from '../../controllers/user.controller';
import { adminGuard, authGuard } from '../../middlewares/auth.middleware';

/**
 * Express router for user-related routes.
 */
const router = Router();


/**
 * Route to fetch all users.
 * - GET /
 * - Requires authentication and admin privileges.
 */
router.get('/', authGuard, adminGuard, findAllUsersHandler);

/**
 * Route to fetch the authenticated user's profile.
 * - GET /me
 * - Requires authentication.
 */
router.get('/me', authGuard, findMeHandler);

/**
 * Route to fetch a user by ID.
 * - GET /:id
 * - Requires authentication and admin privileges.
 */
router.get('/:id', authGuard, adminGuard, findUserByIdHandler);

/**
 * Route to fetch public user data by ID.
 * - GET /:id/public
 * - Requires authentication.
 */
router.get('/:id/public', authGuard, findUserPublicByIdHandler);

/**
 * Route to fetch all public user data.
 * - GET /public
 * - Requires authentication.
 */
router.get('/public', authGuard, findAllPublicHandler);

/**
 * Route to fetch users by role.
 * - GET /role/:role
 * - Requires authentication and admin privileges.
 */
router.get('/role/:role', authGuard, adminGuard, findUsersByRoleHandler);


/**
 * Route to fetch a user by email.
 * - GET /email/:email
 * - Requires authentication and admin privileges.
 */
router.get('/email/:email', authGuard, adminGuard, findUserByEmailHandler);

/**
 * Route to check if an email is already used.
 * - GET /email/:email/exists
 * - Requires authentication and admin privileges.
 */
router.get('/email/:email/exists', authGuard, adminGuard, userExistsByEmailHandler);

/**
 * Route to search users.
 * - GET /search
 * - Requires authentication and admin privileges.
 */
router.get('/search', authGuard, adminGuard, searchUsersHandler);

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
 * Route to update a user's password.
 * - PUT /:id/password
 * - Requires authentication.
 */
router.put('/:id/password', authGuard, updateUserPasswordHandler);

/**
 * Route to deactivate a user.
 * - PUT /:id/deactivate
 * - Requires authentication and admin privileges.
 */
router.put('/:id/deactivate', authGuard, adminGuard, deactivateUserHandler);

/**
 * Route to reactivate a user.
 * - PUT /:id/reactivate
 * - Requires authentication and admin privileges.
 */
router.put('/:id/reactivate', authGuard, adminGuard, reactivateUserHandler);

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
