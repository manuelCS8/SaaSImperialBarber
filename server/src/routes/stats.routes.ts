import { Router } from 'express';
import { getOperationalStatsController } from '../controllers/stast.controller';
import { validateJWT } from '../middlewares/validate-jwt';

const router = Router();

// GET /api/v1/stats
router.get('/', validateJWT, getOperationalStatsController);

export default router;