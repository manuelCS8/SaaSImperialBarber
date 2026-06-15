import { Router } from 'express';
import { UserRole } from '@prisma/client';
import * as barberController from '../controllers/barber.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', barberController.list);
router.get('/:barberId/commissions', authorize(UserRole.admin_owner, UserRole.barber), barberController.commissions);

export default router;
