import { Router } from 'express';
import { login, register } from '../../controllers/auth.controller';

/**
 * Express router for authentication routes.
 */
const router = Router();

/**
 * Route for user login.
 * - POST /login
 */
router.post('/login', login);

/**
 * Route for user registration.
 * - POST /register
 */
router.post('/register', register);

/**
 * Exports the authentication router.
 */
export default router;
