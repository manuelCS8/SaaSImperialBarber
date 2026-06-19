import { Request, Response } from 'express';
import { createClientService } from '../services/client.service';

export const createClientController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone } = req.body;

    // 1. Validar que name y phone no estén vacíos o contengan solo espacios en blanco
    if (!name || !name.trim() || !phone || !phone.trim()) {
      res.status(400).json({ 
        ok: false, 
        message: 'El nombre y el teléfono son campos obligatorios.' 
      });
      return;
    }

    // Ejecutamos el servicio
    const newClient = await createClientService({ name: name.trim(), phone });

    res.status(201).json({
      ok: true,
      message: 'Cliente creado exitosamente.',
      data: newClient
    });

  } catch (error: any) {
    // Capturamos los errores controlados del servicio en español
    if (error.message === 'VALIDACION_TELEFONO_MIN_LONGITUD') {
      res.status(400).json({ ok: false, message: 'El teléfono debe contener un mínimo de 10 dígitos.' });
      return;
    }

    if (error.message === 'CLIENTE_TELEFONO_YA_EXISTE') {
      res.status(400).json({ ok: false, message: 'Ya existe un cliente registrado con este número de teléfono.' });
      return;
    }

    // Error genérico por si falla otra cosa
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor al crear el cliente.' });
  }
};