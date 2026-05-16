import request from 'supertest';
import app from '../src/app';

describe('Route tests', () => {
  describe('GET /', () => {
    it('should return welcome text', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Welcome to Express.js on Vercel');
    });
  });

  describe('GET /about', () => {
    it('should return service metadata', async () => {
      const response = await request(app).get('/about');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        service: 'express-js-on-vercel',
        stack: ['TypeScript', 'Express.js', 'Vercel'],
      });
    });
  });

  describe('GET /api-data', () => {
    it('should return API payload with timestamp', async () => {
      const response = await request(app).get('/api-data');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(['alpha', 'beta', 'gamma']);
      expect(typeof response.body.timestamp).toBe('string');
      expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
    });
  });

  describe('GET /healthz', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/healthz');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /contact', () => {
    it('should accept valid contact payload', async () => {
      const response = await request(app).post('/contact').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello there',
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Contact request received.',
        contact: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          message: 'Hello there',
        },
      });
    });

    it('should reject missing name', async () => {
      const response = await request(app).post('/contact').send({
        email: 'jane@example.com',
        message: 'Hello there',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Name is required and must be 1-100 characters.',
      });
    });

    it('should reject invalid email', async () => {
      const response = await request(app).post('/contact').send({
        name: 'Jane Doe',
        email: 'not-an-email',
        message: 'Hello there',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'A valid email is required.' });
    });

    it('should reject missing message', async () => {
      const response = await request(app).post('/contact').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Message is required and must be 1-1000 characters.',
      });
    });
  });

  describe('Rate limiter', () => {
    it('should apply standard rate limit headers', async () => {
      const response = await request(app).get('/healthz');

      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });
  });
});
