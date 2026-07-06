import { Router } from 'express';
import { checkResendStatus } from '../controllers/integration.controller';
// Si manejas un middleware de autenticación como el de tu imagen (validate-jwt), puedes importarlo aquí
// import { validateJWT } from '../middlewares/validate-jwt';

const router = Router();

// Definimos la ruta. Si deseas protegerla para la demo con tu middleware, agregas validateJWT antes del controlador.
router.get('/resend/status', checkResendStatus);

export default router;