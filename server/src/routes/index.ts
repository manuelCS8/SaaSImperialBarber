import { Router } from 'express';
import clientRoutes from './client.routes'; 
import statsRoutes from './stats.routes';   
import integrationRoutes from './integration.routes'; // 👈 1. IMPORTA TU NUEVA RUTA

const router = Router();

router.use('/clients', clientRoutes);
router.use('/stats', statsRoutes); 

router.use('/integrations', integrationRoutes);

export default router;