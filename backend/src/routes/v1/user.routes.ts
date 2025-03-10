import { Router } from 'express';
import {
  getProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../../controllers/user.controller';
import { adminGuard, authGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/me', authGuard, getProfile);
router.get('/:id', authGuard, getUserById);
router.get('/', authGuard, adminGuard, getAllUsers);

// Nouvelles routes
router.post('/', authGuard, adminGuard, createUser);
router.put('/:id', authGuard, adminGuard, updateUser);
router.delete('/:id', authGuard, adminGuard, deleteUser);

export default router;
