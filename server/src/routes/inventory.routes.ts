import { Router } from 'express';
import { UserRole } from '@prisma/client';
import * as inventoryController from '../controllers/inventory.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/critical', authorize(UserRole.admin_owner, UserRole.barber), inventoryController.critical);
router.post('/movements', authorize(UserRole.admin_owner), inventoryController.movement);

export default router;
