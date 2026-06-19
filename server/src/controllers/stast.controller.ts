import { Request, Response } from 'express';
import { getOperationalStatsService } from '../services/stats.service';

export const getOperationalStatsController = async (req: Request, res: Response) => {
  try {
    const stats = await getOperationalStatsService();
    
    res.status(200).json({
      ok: true,
      data: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error al calcular el resumen operativo.' });
  }
};