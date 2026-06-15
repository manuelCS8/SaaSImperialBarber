import { Router } from 'express';
import { UserRole } from '@prisma/client';
import * as serviceController from '../controllers/service.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', serviceController.list);
router.post('/', authenticate, authorize(UserRole.admin_owner), serviceController.create);

export default router;
