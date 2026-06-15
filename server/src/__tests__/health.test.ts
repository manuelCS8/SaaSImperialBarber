import request from 'supertest';
import app from '../app';

describe('GET /api/v1/health', () => {
  it('responde 200 con estado success', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toContain('operando correctamente');
  });
});
