import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// --- SIMULACIONES DE ENDPOINTS ---

// Endpoint de Login (Commit #1)
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === 'barber@imperial.com' && password === 'Password123') {
    return res.status(200).json({ success: true, token: 'fake-jwt-token' });
  }
  return res.status(400).json({ error: 'Credenciales inválidas' });
});

// Endpoint de Servicios (Commit #2)
app.get('/api/v1/services', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer fake-jwt-token') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  return res.status(200).json([
    { id: 1, name: 'Corte de Cabello Premium', price: 250 },
    { id: 2, name: 'Perfilado de Barba Imperial', price: 150 }
  ]);
});

// --- SUITE PRINCIPAL DE PRUEBAS ---
describe('Pruebas de la API - SaaSImperialBarber', () => {
  
  // Pruebas de Login
  describe('POST /api/v1/auth/login', () => {
    it('Debería responder 200 y regresar un token con credenciales correctas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'barber@imperial.com', password: 'Password123' });
        
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('Debería responder 400 cuando las credenciales son inválidas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'barber@imperial.com', password: 'password-incorrecto' });
        
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Credenciales inválidas');
    });
  });

  // Pruebas de Servicios
  describe('GET /api/v1/services', () => {
    it('Debería responder 200 y regresar la lista de servicios si está autenticado', async () => {
      const response = await request(app)
        .get('/api/v1/services')
        .set('Authorization', 'Bearer fake-jwt-token');
        
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Debería responder 401 si no se envía el token de autenticación', async () => {
      const response = await request(app)
        .get('/api/v1/services');
        
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('No autorizado');
    });
  });

});