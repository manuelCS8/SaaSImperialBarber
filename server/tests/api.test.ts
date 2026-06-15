import request from 'supertest';
import express from 'express';

// Creamos una app de Express temporal para verificar que tus herramientas
// Jest y Supertest validan correctamente los códigos HTTP (200, 400, 403)
const app = express();

app.get('/api/v1/test-200', (req, res) => {
  res.status(200).json({ success: true });
});

app.get('/api/v1/test-400', (req, res) => {
  res.status(400).json({ error: 'Bad Request' });
});

app.get('/api/v1/test-403', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

describe('Estructura Base de Pruebas HTTP - SaaSImperialBarber', () => {
  it('Debería responder y validar un código de estado 200', async () => {
    const response = await request(app).get('/api/v1/test-200');
    expect(response.statusCode).toBe(200);
  });

  it('Debería responder y validar un código de estado 400', async () => {
    const response = await request(app).get('/api/v1/test-400');
    expect(response.statusCode).toBe(400);
  });

  it('Debería responder y validar un código de estado 403', async () => {
    const response = await request(app).get('/api/v1/test-403');
    expect(response.statusCode).toBe(403);
  });
});