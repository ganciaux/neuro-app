import { Router } from 'express';
import authRoutes from './v1/authRoutes';
import userRoutes from './v1/userRoutes';

const router = Router();
const API_VERSION = '/v1';

router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/users`, userRoutes);

export default router;