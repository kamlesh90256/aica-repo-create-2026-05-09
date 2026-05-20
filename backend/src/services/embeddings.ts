import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const vectorStorePath = path.join(__dirname, '../../data/vector-store.json');

type VectorRecord = {
  id: string;
  vector: number[];
  metadata: Record<string, unknown>;
  createdAt: string;
};

function ensureVectorStoreDir() {
  fs.mkdirSync(path.dirname(vectorStorePath), { recursive: true });
}

function loadVectorStore(): VectorRecord[] {
  try {
    if (!fs.existsSync(vectorStorePath)) return [];
    const raw = fs.readFileSync(vectorStorePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as VectorRecord[]) : [];
  } catch {
    return [];
  }
}

function saveVectorStore(records: VectorRecord[]) {
  ensureVectorStoreDir();
  fs.writeFileSync(vectorStorePath, JSON.stringify(records, null, 2));
}

function normalizeVector(vector: number[]) {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!magnitude) return vector;
  return vector.map((value) => Number((value / magnitude).toFixed(6)));
}

function createLocalEmbedding(text: string) {
  const dimensions = 64;
  const vector = new Array(dimensions).fill(0);
  const tokens = text.toLowerCase().match(/[a-z0-9]+/g) || [];

  for (const token of tokens) {
    let hash = 0;
    for (let index = 0; index < token.length; index += 1) {
      hash = (hash * 31 + token.charCodeAt(index)) >>> 0;
    }
    vector[hash % dimensions] += 1;
    vector[(hash >>> 8) % dimensions] += 0.5;
  }

  return normalizeVector(vector);
}

export async function createEmbedding(text: string) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key') {
    return createLocalEmbedding(text);
  }

  const resp = await client.embeddings.create({ model: 'text-embedding-3-small', input: text } as any);
  return resp.data[0].embedding;
}

export async function upsertToVectorDB(id: string, vector: number[], metadata: any) {
  const records = loadVectorStore();
  const nextRecords = [
    ...records.filter((record) => record.id !== id),
    {
      id,
      vector,
      metadata: metadata ?? {},
      createdAt: new Date().toISOString()
    }
  ];

  saveVectorStore(nextRecords);
  return { id, dimensions: vector.length };
}
