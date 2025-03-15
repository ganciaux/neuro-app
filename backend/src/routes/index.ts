import { Router } from 'express';
import authRoutes from './v1/auth.routes';
import userRoutes from './v1/user.routes';

/**
 * Express router for API routes.
 */
const router = Router();

/** Base path for the API. */
const API_BASE_PATH = '/api';

/** API version. */
const API_VERSION = '/v1';

/**
 * Mounts authentication routes under `/api/v1/auth`.
 */
router.use(`${API_BASE_PATH}${API_VERSION}/auth`, authRoutes);

/**
 * Mounts user routes under `/api/v1/users`.
 */
router.use(`${API_BASE_PATH}${API_VERSION}/users`, userRoutes);

/**
 * Exports the API router.
 */
export default router;
