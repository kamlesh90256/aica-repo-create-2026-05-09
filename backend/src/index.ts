import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import chatRouter from './routes/chat';
import uploadRouter from './routes/upload';
import resumeRouter from './routes/resume';
import authRouter from './routes/auth';
import paymentsRouter from './routes/payments';
import { prisma } from './prisma';

import { createCheckoutSession, handleCheckoutSessionCompleted, handleSubscriptionUpdated, handleSubscriptionDeleted, stripe } from './services/stripe';

dotenv.config({ path: process.env.NODE_ENV === 'development' ? '.env.local' : '.env' });

const app = express();
const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: '*' } });

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(limiter);
app.use(cors({ origin: corsOrigin, credentials: true }));

// Stripe webhook handler (needs raw body, before express.json)
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req: express.Request, res: express.Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !stripe) {
    return res.status(400).json({ error: 'Webhook not configured' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    console.log(`Webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted((event.data.object as any).id);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated((event.data.object as any).id);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted((event.data.object as any).id);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

app.use(express.json({ limit: '2mb' }));

app.use('/api/chat', chatRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/auth', authRouter);
app.use('/api/payments', paymentsRouter);

app.get('/api/history', async (req, res) => {
  const header = req.headers.authorization as string | undefined;
  if (!header) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.split(' ')[1];
  try {
    const jwt = await import('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'devsecret';
    const payload = jwt.verify(token, secret) as any;
    const userId = payload.sub || payload.id;
    if (!userId) return res.status(400).json({ error: 'Invalid token payload' });
    const chats = await prisma.chat.findMany({ where: { userId }, include: { messages: true } });
    res.json({ chats });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
