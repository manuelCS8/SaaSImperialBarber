import { Router } from 'express';
import { UserRole } from '@prisma/client';
import * as clientController from '../controllers/client.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', authorize(UserRole.admin_owner, UserRole.barber), clientController.list);
router.post('/', authorize(UserRole.admin_owner, UserRole.barber), clientController.create);
router.get('/:id', authorize(UserRole.admin_owner, UserRole.barber), clientController.getById);

export default router;
