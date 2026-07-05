import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { isResendConfigured } from '../services/email.service';
import { sendSuccess } from '../utils/response';

const router = Router();

router.use(authenticate, authorize(UserRole.admin_owner));

router.get('/resend/status', (_req, res) => {
  return sendSuccess(res, {
    provider: 'resend',
    configured: isResendConfigured(),
    docs: 'https://resend.com/docs',
  });
});

export default router;
