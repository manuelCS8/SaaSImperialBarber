import { Router } from 'express';
import { createClientController } from '../controllers/client.controller';

const router = Router();

// POST /api/v1/clients (Ruta para crear un cliente)
router.post('/', createClientController);

export default router;