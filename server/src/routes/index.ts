import { Router } from 'express';
import clientRoutes from './client.routes'; 
import statsRoutes from './stats.routes';   
import integrationRoutes from './integration.routes'; 
import appointmentRoutes from './appointments.routes'; 

const router = Router();

router.use('/clients', clientRoutes);
router.use('/stats', statsRoutes); 
router.use('/integrations', integrationRoutes);
router.use('/appointments', appointmentRoutes);

export default router;