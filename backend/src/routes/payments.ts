import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { createCheckoutSession, handleCheckoutSessionCompleted, handleSubscriptionUpdated, handleSubscriptionDeleted, stripe, getUserSubscription } from '../services/stripe';

const router = Router();

// Auth middleware
function requireAuth(req: Request, res: Response, next: Function) {
  const header = req.headers.authorization as string | undefined;
  if (!header) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'devsecret';
    const payload = jwt.verify(token, secret) as any;
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Schema validation
const checkoutSchema = z.object({
  planId: z.enum(['starter', 'pro', 'enterprise'])
});

// Create checkout session
router.post('/checkout', requireAuth, async (req: Request, res: Response) => {
  try {
    const { planId } = checkoutSchema.parse(req.body);
    const userId = (req as any).user?.sub || (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const origin = req.headers.origin || 'http://localhost:3000';
    const session = await createCheckoutSession(userId, planId, origin);

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Checkout failed' });
  }
});

// Get subscription
router.get('/subscription', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub || (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscription = await getUserSubscription(userId);
    res.json(subscription || { status: 'inactive' });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

export default router;
