import { Router } from 'express';
import authRoutes from './auth.routes';
import appointmentRoutes from './appointment.routes';
import clientRoutes from './client.routes';
import serviceRoutes from './service.routes';
import barberRoutes from './barber.routes';
import inventoryRoutes from './inventory.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/clients', clientRoutes);
router.use('/services', serviceRoutes);
router.use('/barbers', barberRoutes);
router.use('/inventory', inventoryRoutes);

export default router;
