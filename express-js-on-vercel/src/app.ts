import express, { type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const app = express();

app.set('trust proxy', 1);

app.use(express.json());

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
    max: Number(process.env.RATE_LIMIT_MAX ?? 100),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  }),
);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Welcome to Express.js on Vercel');
});

app.get('/about', (_req: Request, res: Response) => {
  res.status(200).json({
    service: 'express-js-on-vercel',
    stack: ['TypeScript', 'Express.js', 'Vercel'],
  });
});

app.get('/api-data', (_req: Request, res: Response) => {
  res.status(200).json({
    data: ['alpha', 'beta', 'gamma'],
    timestamp: new Date().toISOString(),
  });
});

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/contact', (req: Request, res: Response) => {
  const payload = (req.body ?? {}) as ContactPayload;
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Name is required and must be 1-100 characters.' });
  }

  if (!email || !emailPattern.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  if (!message || message.length > 1000) {
    return res.status(400).json({ error: 'Message is required and must be 1-1000 characters.' });
  }

  return res.status(201).json({
    success: true,
    message: 'Contact request received.',
    contact: {
      name,
      email,
      message,
    },
  });
});

export default app;
