import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client);