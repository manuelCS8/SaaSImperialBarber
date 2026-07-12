import { Router } from 'express';
import { checkResendStatus } from '../controllers/integration.controller';
// Importamos el nuevo middleware de seguridad
import { protectAndAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Inyectamos el middleware para proteger el endpoint
router.get('/resend/status', protectAndAdmin, checkResendStatus);

export default router;