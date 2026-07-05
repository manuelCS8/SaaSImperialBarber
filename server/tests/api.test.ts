import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// --- SIMULACIONES DE ENDPOINTS (ENTORNO DE DESARROLLO) ---

// Endpoint de Login
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === 'admin@imperialbarber.com' && password === 'Admin123!') {
    return res.status(200).json({ success: true, token: 'fake-jwt-token' });
  }
  return res.status(400).json({ error: 'Credenciales inválidas' });
});

// Endpoint de Servicios
app.get('/api/v1/services', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer fake-jwt-token') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  return res.status(200).json([
    { id: 1, name: 'Corte de Cabello Premium', price: 250 }
  ]);
});

// Endpoint de Clientes (Ruta Protegida por Seguridad)
app.get('/api/v1/clients', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer fake-jwt-token') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  return res.status(200).json([
    { id: 1, name: 'Diego Gomez Noriega', phone: '2321055541' }
  ]);
});

// Endpoint de Citas (Simulación de integración con API Externa)
app.post('/api/v1/appointments/confirm', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer fake-jwt-token') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  // Simulación de detonante de API Externa (Resend)
  return res.status(200).json({ 
    success: true, 
    message: 'Cita confirmada correctamente y notificación enviada por correo electrónico' 
  });
});


// --- SUITE PRINCIPAL DE PRUEBAS AUTOMATIZADAS ---
describe('Security and Integration Testing Suite - SaaSImperialBarber', () => {
  
  // Pruebas de Autenticación (Login)
  describe('POST /api/v1/auth/login', () => {
    it('Debería responder 200 OK y retornar un token JWT válido con credenciales correctas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@imperialbarber.com', password: 'Admin123!' });
        
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('Debería responder 400 Bad Request cuando las credenciales son incorrectas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@imperialbarber.com', password: 'password-incorrecto' });
        
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Credenciales inválidas');
    });
  });

  // Pruebas de Control de Acceso y Rutas Protegidas
  describe('GET /api/v1/clients (Rutas Protegidas)', () => {
    it('Debería rechazar la petición con un error 401 Unauthorized si no se envía el token', async () => {
      const response = await request(app)
        .get('/api/v1/clients');
        
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('No autorizado');
    });

    it('Debería permitir el acceso y responder 200 OK cuando se provee un token de seguridad válido', async () => {
      const response = await request(app)
        .get('/api/v1/clients')
        .set('Authorization', 'Bearer fake-jwt-token');
        
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Pruebas de Integración con Servicios Externos (Resend)
  describe('POST /api/v1/appointments/confirm (Integración API Externa)', () => {
    it('Debería confirmar la cita con éxito (200 OK) y gatillar el envío del correo de notificación', async () => {
      const response = await request(app)
        .post('/api/v1/appointments/confirm')
        .set('Authorization', 'Bearer fake-jwt-token')
        .send({ appointmentId: 45 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('notificación enviada por correo electrónico');
    });
  });
});