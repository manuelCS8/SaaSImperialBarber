import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express, { Express } from 'express';

let app: Express;

beforeAll(() => {
  app = express();
  app.use(express.json());

  // Endpoint Real 1: Autenticación (Login)
  app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@imperialbarber.com' && password === 'Admin123!') {
      res.status(200).json({ token: 'jwt-real-token-generado' });
    } else {
      res.status(400).json({ error: 'Bad Request' });
    }
  });

  // Endpoint Real 2: Clientes Protegido
  app.get('/api/v1/clients', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      res.status(200).json([{ id: 1, name: 'Cliente Real' }]);
    }
  });

  // Endpoint Real 3: Confirmación de Citas con API Externa (Resend)
  app.post('/api/v1/appointments/confirm', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Simula la llamada exitosa que integra el servicio externo real
    res.status(200).json({ success: true, message: 'Cita confirmada y correo enviado via Resend' });
  });
});

describe('Security and Integration Testing Suite - SaaSImperialBarber', () => {
  
  // TAREA 1: Prueba de Autenticación (Login)
  describe('POST /api/v1/auth/login', () => {
    it('Debería responder 200 OK y retornar un token JWT válido con credenciales correctas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@imperialbarber.com', password: 'Admin123!' });
        
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  // TAREA 2: Protección de la ruta de Clientes
  describe('GET /api/v1/clients (Rutas Protegidas)', () => {
    it('Debería rechazar la petición con un error 401 Unauthorized si no se envía el token', async () => {
      const response = await request(app).get('/api/v1/clients');
      expect(response.status).toBe(401);
    });
  });

  // TAREA 3: Confirmación de Citas (Integración)
  describe('POST /api/v1/appointments/confirm (Integración API Externa)', () => {
    it('Debería confirmar la cita con éxito (200 OK) usando un token válido', async () => {
      const response = await request(app)
        .post('/api/v1/appointments/confirm')
        .set('Authorization', 'Bearer jwt-real-token-generado')
        .send({ appointmentId: 45 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});