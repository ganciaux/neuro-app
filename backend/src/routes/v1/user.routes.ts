import { Router } from 'express';
import { findMe, findById, findPublicById, findAllPublic, findByEmail, existsByEmail, findByRole, search, create, update, updatePassword, deactivate, reactivate, remove, findAll, uploadUserAvatar } from '../../controllers/user.controller';
import { adminGuard, authGuard } from '../../middlewares/auth.middleware';
import { multerMiddleware } from '../../middlewares/multer.middleware';

/**
 * Express router for user-related routes.
 */
const router = Router();


/**
 * Route to fetch all users.
 * - GET /
 * - Requires authentication and admin privileges.
 */
router.get('/', authGuard, adminGuard, findAll);

/**
 * Route to fetch the authenticated user's profile.
 * - GET /me
 * - Requires authentication.
 */
router.get('/me', authGuard, findMe);

/**
 * Route to fetch a user by ID.
 * - GET /:id
 * - Requires authentication and admin privileges.
 */
router.get('/:id', authGuard, adminGuard, findById);

/**
 * Route to fetch public user data by ID.
 * - GET /:id/public
 * - Requires authentication.
 */
router.get('/:id/public', authGuard, findPublicById);

/**
 * Route to fetch all public user data.
 * - GET /public
 * - Requires authentication.
 */
router.get('/public', authGuard, findAllPublic);

/**
 * Route to fetch users by role.
 * - GET /role/:role
 * - Requires authentication and admin privileges.
 */
router.get('/role/:role', authGuard, adminGuard, findByRole);


/**
 * Route to fetch a user by email.
 * - GET /email/:email
 * - Requires authentication and admin privileges.
 */
router.get('/email/:email', authGuard, adminGuard, findByEmail);

/**
 * Route to check if an email is already used.
 * - GET /email/:email/exists
 * - Requires authentication and admin privileges.
 */
router.get('/email/:email/exists', authGuard, adminGuard, existsByEmail);

/**
 * Route to search users.
 * - GET /search
 * - Requires authentication and admin privileges.
 */
router.get('/search', authGuard, adminGuard, search);

/**
 * Route to create a new user.
 * - POST /
 * - Requires authentication and admin privileges.
 */
router.post('/', authGuard, adminGuard, create);

/**
 * Route to update a user by ID.
 * - PUT /:id
 * - Requires authentication and admin privileges.
 */
router.put('/:id', authGuard, adminGuard, update);

/**
 * Route to update a user's password.
 * - PUT /:id/password
 * - Requires authentication.
 */
router.put('/:id/password', authGuard, updatePassword);

/**
 * Route to deactivate a user.
 * - PUT /:id/deactivate
 * - Requires authentication and admin privileges.
 */
router.put('/:id/deactivate', authGuard, adminGuard, deactivate);

/**
 * Route to reactivate a user.
 * - PUT /:id/reactivate
 * - Requires authentication and admin privileges.
 */
router.put('/:id/reactivate', authGuard, adminGuard, reactivate);

/**
 * Route to delete a user by ID.
 * - DELETE /:id
 * - Requires authentication and admin privileges.
 */
router.delete('/:id', authGuard, adminGuard, remove);

/**
 * Route to upload a user's avatar.
 * - POST /:id/avatar
 * - Requires authentication and admin privileges.
 */
router.post('/:id/avatar', authGuard, adminGuard, multerMiddleware('user').single('file'), uploadUserAvatar);

/**
 * Exports the user router.
 */
export default router;
