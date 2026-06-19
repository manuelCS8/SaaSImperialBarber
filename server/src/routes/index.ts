import { Router } from 'express';
import clientRoutes from './client.routes'; 
import statsRoutes from './stats.routes';   

const router = Router();

router.use('/clients', clientRoutes);
router.use('/stats', statsRoutes); 

export default router;