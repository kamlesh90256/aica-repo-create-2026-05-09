import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createEmbedding(text: string) {
  // Returns vector embedding using OpenAI. In production, push to Pinecone/Chroma.
  const resp = await client.embeddings.create({ model: 'text-embedding-3-small', input: text } as any);
  return resp.data[0].embedding;
}

// Placeholder: integrate with Pinecone or Chroma here
export async function upsertToVectorDB(id: string, vector: number[], metadata: any) {
  // TODO: Add Pinecone client integration and upsert
  console.log('Upsert placeholder', id, vector.length);
}
