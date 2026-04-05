import express from 'express';
import { getUsers, updateUserRole, toggleUserStatus } from '../controllers/user.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(protect);
router.use(authorize(UserRole.ADMIN)); // All routes in this file require ADMIN role

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', toggleUserStatus);

export default router;
