import { Router } from 'express';
import { getProfile, getAllUsers, getUserById } from '../../controllers/user.controller';
import { adminGuard, authGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/me', authGuard, getProfile);
router.get('/:id', authGuard, getUserById);
router.get('/', authGuard, adminGuard, getAllUsers);

export default router;
