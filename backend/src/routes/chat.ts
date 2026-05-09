import { Router } from 'express';
import { OpenAI } from 'openai';
import { generateLocalAssistantReply } from '../services/local-ai';
import { z } from 'zod';
const router = Router();

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string().min(1)
      })
    )
    .min(1)
});

function normalizeMessages(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

function writeSse(res: any, data: string) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post('/', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const messages = normalizeMessages(parsed.data.messages);

    if (!apiKey || apiKey.trim() === '' || apiKey === 'your-openai-api-key') {
      const text = generateLocalAssistantReply(messages);
      return res.json({
        provider: 'local-fallback',
        choices: [{ message: { role: 'assistant', content: text } }]
      });
    }

    const client = new OpenAI({ apiKey });
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

router.post('/stream', async (req, res) => {
  try {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const messages = normalizeMessages(parsed.data.messages);
    const apiKey = process.env.OPENAI_API_KEY;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!apiKey || apiKey.trim() === '' || apiKey === 'your-openai-api-key') {
      const fallback = generateLocalAssistantReply(messages);
      const words = fallback.split(' ');
      for (const word of words) {
        writeSse(res, `${word} `);
        await sleep(12);
      }
      writeSse(res, '[DONE]');
      return res.end();
    }

    const client = new OpenAI({ apiKey });
    const stream = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      stream: true,
      max_tokens: 900
    });

    for await (const part of stream) {
      const delta = part.choices?.[0]?.delta?.content || '';
      if (delta) writeSse(res, delta.replace(/\r?\n/g, ' \n '));
    }

    writeSse(res, '[DONE]');
    res.end();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Streaming failed' });
    }
    writeSse(res, '[DONE]');
    res.end();
  }
});

export default router;
