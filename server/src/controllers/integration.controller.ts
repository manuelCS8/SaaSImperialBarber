import { Request, Response } from 'express';
import { getResendStatus } from '../services/integration.service';

export const checkResendStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.query;

    // Validación: Verificar que el email venga en los parámetros de búsqueda
    if (!email || typeof email !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'El parámetro email es requerido y debe ser un texto válido.'
      });
      return;
    }

    // Llamamos al servicio para buscar el estado del usuario/integración
    const statusData = await getResendStatus(email);

    // Si el servicio devuelve null, significa que no se encontró el usuario
    if (!statusData) {
      res.status(404).json({
        error: 'Not Found',
        message: 'No se encontró ninguna integración activa para el email proporcionado.'
      });
      return;
    }

    // Si todo sale bien, devolvemos un estado 200 con la información
    res.status(200).json(statusData);
  } catch (error) {
    console.error('Error en checkResendStatus:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al consultar el estado en el proveedor del servicio.'
    });
  }
};