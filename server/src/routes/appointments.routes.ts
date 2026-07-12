import { Router } from 'express';
import { updateAppointmentStatus } from '../controllers/appointment.controller';
import { protectAndAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Protegemos la ruta tal como lo pide la descripción de la HU-02
router.put('/:id/status', protectAndAdmin, updateAppointmentStatus);

export default router;