import { Router } from 'express';
import { getProfile, getAllUsers, getUserById } from '../../controllers/userController';
import { adminGuard, authGuard } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/me', authGuard, getProfile);
router.get('/:id', authGuard, getUserById);
router.get('/', authGuard, adminGuard, getAllUsers);

export default router;
