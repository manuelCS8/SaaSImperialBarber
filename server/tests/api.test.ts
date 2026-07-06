import { describe, it, expect } from '@jest/globals';
import request from 'supertest';

// Apuntamos a la URL exacta del servidor real que indica el QUICKSTART
const API_URL = 'http://localhost:5000'; 

describe('Security and Integration Testing Suite - SaaSImperialBarber', () => {
  
  // TAREA 1: Prueba de Autenticación (Login)
  describe('POST /api/v1/auth/login', () => {
    it('Debería responder 200 OK y retornar un token JWT válido con credenciales correctas', async () => {
      const response = await request(API_URL)
        .post('/api/v1/auth/login')
        .send({ 
          email: 'admin@imperialbarber.com', 
          password: 'Admin123!' 
        });
        
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  // TAREA 2: Protección de la ruta de Clientes
  describe('GET /api/v1/clients (Rutas Protegidas)', () => {
    it('Debería rechazar la petición con un error 401 Unauthorized si no se envía el token', async () => {
      const response = await request(API_URL)
        .get('/api/v1/clients');
        
      expect(response.status).toBe(401);
    });
  });

  // TAREA 3: Confirmación de Citas (Integración)
  describe('POST /api/v1/appointments/confirm (Integración API Externa)', () => {
    it('Debería confirmar la cita con éxito (200 OK) usando un token válido', async () => {
      const response = await request(API_URL)
        .post('/api/v1/appointments/confirm')
        .set('Authorization', 'Bearer fake-jwt-token')
        .send({ appointmentId: 45 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});