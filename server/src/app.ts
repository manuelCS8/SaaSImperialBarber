import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Configurar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Aduana de Seguridad: Middlewares Globales
app.use(helmet()); // Inyección de cabeceras seguras contra vulnerabilidades web
app.use(cors({ origin: '*' })); // Configuración inicial de CORS (ajustar en producción)
app.use(express.json()); // Sanitización y parseo estricto de payloads en formato JSON

// Endpoint de salud del sistema (Health Check)
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'SaaSImperialBarber API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
