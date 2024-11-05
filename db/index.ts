import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.SUPABASE_DATABASE_URL
    : process.env.LOCAL_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export const client = postgres(databaseUrl);
export const db = drizzle(client);
