import { Router } from 'express';
import { UserRole } from '@prisma/client';
import * as appointmentController from '../controllers/appointment.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', appointmentController.list);
router.post('/', authorize(UserRole.admin_owner, UserRole.barber, UserRole.client), appointmentController.create);
router.patch('/:id/status', authorize(UserRole.admin_owner, UserRole.barber), appointmentController.updateStatus);
router.post('/:id/complete', authorize(UserRole.admin_owner, UserRole.barber), appointmentController.complete);

export default router;
