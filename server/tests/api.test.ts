import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express, { Request, Response } from 'express';

// Creamos la app de Express temporal para simular nuestro servidor
const app = express();
app.use(express.json()); // Permite leer formatos JSON en las peticiones

// mock o simulación del endpoint de login del negocio
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (email === 'barber@imperial.com' && password === 'Password123') {
    return res.status(200).json({ success: true, token: 'fake-jwt-token' });
  }
  
  return res.status(400).json({ error: 'Credenciales inválidas' });
});

// Suite principal de pruebas expandida
describe('Pruebas de la API - SaaSImperialBarber', () => {
  
  describe('POST /api/v1/auth/login', () => {
    
    it('Debería responder 200 y regresar un token con credenciales correctas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'barber@imperial.com',
          password: 'Password123'
        });
        
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('Debería responder 400 cuando las credenciales son inválidas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'barber@imperial.com',
          password: 'password-incorrecto'
        });
        
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Credenciales inválidas');
    });

  });

});