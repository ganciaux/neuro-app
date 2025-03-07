import { Router } from 'express';
import authRoutes from './v1/auth.routes';
import userRoutes from './v1/user.routes';

const router = Router();
const API_VERSION = '/v1';

router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/users`, userRoutes);

export default router;