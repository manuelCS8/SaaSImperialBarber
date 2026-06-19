import { Request, Response, NextFunction } from 'express';

export const validateJWT = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 1. Simulación temporal para que no te trabe las rutas:
    // En producción, aquí leerías el token de req.headers['x-token'] o req.headers.authorization
    
    console.log('Pasando por la validación de JWT (Simulado)...');
    
    // Le inyectamos un usuario ficticio a la petición por si tus servicios lo necesitan
    (req as any).user = { id: 'admin-id-123', role: 'ADMIN' };

    // 2. next() le dice a Express que continúe al controlador (getOperationalStatsController)
    next();
  } catch (error) {
    res.status(401).json({
      ok: false,
      message: 'Token no válido o expirado.'
    });
  }
};