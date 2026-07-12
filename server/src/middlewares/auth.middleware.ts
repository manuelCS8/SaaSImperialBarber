import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
}

export const protectAndAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    let token;

    // 1. Validar presencia del JWT en las cabeceras
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Si no hay token: 401 Unauthorized
    if (!token) {
      return res.status(401).json({ message: 'No autorizado, no se proporcionó un token.' });
    }

    // 2. Verificar validez del token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_generic') as JwtPayload;

    // 3. Consulta estricta a la base de datos usando Prisma
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    // 4. Limitar acceso estrictamente al rol 'admin_owner'
    // Si no es admin_owner: 403 Forbidden
    if (user.role !== 'admin_owner') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol admin_owner.' });
    }

    // Si todo está correcto, avanzamos al controlador
    (req as any).user = user; 
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Token no válido o expirado.' });
  }
};