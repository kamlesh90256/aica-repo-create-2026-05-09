import { Router } from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    // Minimal streaming-style reply: for production implement streaming via SSE or websockets
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 800
    } as any);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chat error' });
  }
});

export default router;
