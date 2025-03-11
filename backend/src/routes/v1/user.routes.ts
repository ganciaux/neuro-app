import { Router } from 'express';
import {
  getProfile,
  getAllUsers,
  getUserById,
  createUserHandler,
  updateUser,
  deleteUser,
} from '../../controllers/user.controller';
import { adminGuard, authGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/me', authGuard, getProfile);
router.get('/:id', authGuard, adminGuard, getUserById);
router.get('/', authGuard, adminGuard, getAllUsers);

router.post('/', authGuard, adminGuard, createUserHandler);
router.put('/:id', authGuard, adminGuard, updateUser);
router.delete('/:id', authGuard, adminGuard, deleteUser);

export default router;
